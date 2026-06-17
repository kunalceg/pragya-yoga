// ============================================================
// controllers/adminController.js
// Admin-only handlers. Mounted behind requireAuth + requireAdmin.
// ============================================================
import bcrypt from 'bcryptjs';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import Membership from '../models/Membership.js';
import Attendance from '../models/Attendance.js';
import Payment from '../models/Payment.js';
import ClassSession from '../models/ClassSession.js';
import Workshop from '../models/Workshop.js';
import Download from '../models/Download.js';
import Consultation from '../models/Consultation.js';
import Notification from '../models/Notification.js';
import Lead from '../models/Lead.js';
import Booking from '../models/Booking.js';
import Batch from '../models/Batch.js';
import Coupon from '../models/Coupon.js';
import Course from '../models/Course.js';
import Plan from '../models/Plan.js';
import Settings from '../models/Settings.js';
import ActivityLog from '../models/ActivityLog.js';
import { ensureReferral } from '../services/referralService.js';
import { notify } from '../services/notificationService.js';

const DAY = 86400000;

async function log(action, req, targetUser = null, meta = {}) {
  try { await ActivityLog.create({ action, performedBy: req.user._id, targetUser, meta }); }
  catch (e) { console.error('ActivityLog failed:', e.message); }
}

// ── Overview / analytics ─────────────────────────────────────
export const getOverview = asyncHandler(async (req, res) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1); startOfMonth.setHours(0, 0, 0, 0);
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);

  const [
    totalStudents, activeStudents, bannedStudents, newThisMonth,
    totalLeads, totalBatches, totalBookings, pendingBookings,
    revenueAgg, recentStudents, todaySchedule, settings, activeMemberships,
  ] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'student', status: 'active' }),
    User.countDocuments({ role: 'student', status: 'banned' }),
    User.countDocuments({ role: 'student', createdAt: { $gte: startOfMonth } }),
    Lead.countDocuments(),
    Batch.countDocuments(),
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'Pending' }),
    Payment.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    User.find({ role: 'student' }).sort({ createdAt: -1 }).limit(6).select('name email createdAt status planMonths'),
    ClassSession.find({ date: { $gte: todayStart, $lte: todayEnd } }).sort({ date: 1 }),
    Settings.getSingleton(),
    Membership.countDocuments({ status: 'active', expiryDate: { $gt: new Date() } }),
  ]);

  const revenue = revenueAgg[0]?.total || 0;
  const i = settings.integrations;
  const systemHealth = [
    { label: 'Payment Gateway API', status: i.paymentGateway ? 'Operational' : 'Down', ok: i.paymentGateway },
    { label: 'Zoom Streaming Bridge', status: i.zoom ? 'Live' : 'Offline', ok: i.zoom },
    { label: 'WhatsApp Business API', status: i.whatsapp ? 'Connected' : 'Disconnected', ok: i.whatsapp },
    { label: 'Email SMTP Node', status: i.emailSmtp ? 'Operational' : 'Degraded', ok: i.emailSmtp },
  ];

  res.json({
    metrics: { activeStudents, totalStudents, bannedStudents, newThisMonth, revenue, activeMemberships, pendingBookings },
    totalLeads, totalBatches, totalBookings,
    recentStudents,
    todaySchedule: todaySchedule.map((c) => ({
      label: `${c.name} — ${c.time || ''}`.trim(),
      badge: c.status === 'completed' ? 'Completed' : `${c.enrolledUsers.length} enrolled`,
    })),
    systemHealth,
    announcementBanner: settings.announcementBanner,
  });
});

export const getRevenueAnalytics = asyncHandler(async (req, res) => {
  const since = new Date(Date.now() - 180 * DAY);
  const series = await Payment.aggregate([
    { $match: { status: 'paid', date: { $gte: since } } },
    { $group: { _id: { y: { $year: '$date' }, m: { $month: '$date' } }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { '_id.y': 1, '_id.m': 1 } },
  ]);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  res.json(series.map((s) => ({ month: `${months[s._id.m - 1]} ${s._id.y}`, total: s.total, count: s.count })));
});

// ── Students ─────────────────────────────────────────────────
export const getStudents = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const q = { role: 'student' };
  if (search) {
    q.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { city: new RegExp(search, 'i') },
    ];
  }
  const students = await User.find(q).sort({ createdAt: -1 });
  res.json(students);
});

export const getStudentById = asyncHandler(async (req, res) => {
  const student = await User.findById(req.params.id);
  if (!student) throw ApiError.notFound('Student not found');
  const [membership, payments, attendanceCount] = await Promise.all([
    Membership.findOne({ user: student._id }).sort({ createdAt: -1 }),
    Payment.find({ user: student._id }).sort({ date: -1 }),
    Attendance.countDocuments({ user: student._id, status: { $in: ['present', 'zoom'] } }),
  ]);
  res.json({ student, membership, payments, attendanceCount });
});

export const createStudent = asyncHandler(async (req, res) => {
  const { name, email, password, phone, city, style, level, planMonths } = req.body;
  if (!name || !email) throw ApiError.badRequest('Name and email are required');
  if (await User.findOne({ email: email.toLowerCase().trim() })) throw ApiError.conflict('Email already registered');

  const raw = password && password.trim() ? password : 'Yoga@1234';
  const hashed = await bcrypt.hash(raw, await bcrypt.genSalt(10));
  const student = await User.create({
    name, email: email.toLowerCase().trim(), password: hashed,
    phone: phone || '', city: city || '', style: style || 'Hatha', level: level || 'Beginner',
    planMonths: planMonths || 0, role: 'student', status: 'active',
  });
  await ensureReferral(student);
  await log(`Added student: ${student.email}`, req, student._id);
  res.status(201).json(student);
});

export const updateStudent = asyncHandler(async (req, res) => {
  const allowed = ['name', 'email', 'phone', 'city', 'style', 'level', 'planMonths', 'status', 'bio'];
  const updates = {};
  for (const f of allowed) if (req.body[f] !== undefined) updates[f] = req.body[f];

  if (updates.email) {
    const owner = await User.findOne({ email: updates.email.toLowerCase().trim() });
    if (owner && owner._id.toString() !== req.params.id) throw ApiError.conflict('Email already in use');
    updates.email = updates.email.toLowerCase().trim();
  }
  const student = await User.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true });
  if (!student) throw ApiError.notFound('Student not found');
  await log(`Edited student: ${student.email}`, req, student._id);
  res.json(student);
});

export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await User.findByIdAndDelete(req.params.id);
  if (!student) throw ApiError.notFound('Student not found');
  await log(`Deleted student: ${student.email}`, req);
  res.json({ success: true, msg: 'Student deleted' });
});

export const setStudentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['active', 'banned', 'pending'].includes(status)) throw ApiError.badRequest('Invalid status');
  const student = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!student) throw ApiError.notFound('Student not found');
  await log(`Set status=${status} for ${student.email}`, req, student._id);
  res.json(student);
});

// ── Plans assignment ─────────────────────────────────────────
export const assignPlan = asyncHandler(async (req, res) => {
  const { studentId, planMonths, planType, price } = req.body;
  if (!studentId || !planMonths) throw ApiError.badRequest('studentId and planMonths are required');

  const plan = await Plan.findOne({ durationMonths: Number(planMonths) });
  const expiry = new Date(Date.now() + Number(planMonths) * 30 * DAY);
  const m = await Membership.findOneAndUpdate(
    { user: studentId },
    {
      user: studentId,
      planType: planType || plan?.name || `${planMonths}-Month Membership`,
      planMonths: Number(planMonths),
      price: price ?? plan?.price ?? 0,
      status: 'active',
      startDate: new Date(),
      expiryDate: expiry,
      $push: { history: { action: 'created', planMonths: Number(planMonths) } },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await User.findByIdAndUpdate(studentId, { planMonths: Number(planMonths) });
  if (price) await Payment.create({ user: studentId, label: m.planType, amount: price, status: 'paid' });
  await notify(studentId, { title: 'Plan activated', message: `Your ${m.planType} is now active.`, type: 'success' });
  await log(`Assigned ${planMonths}-mo plan to ${studentId}`, req, studentId);
  res.json(m);
});

export const revokePlan = asyncHandler(async (req, res) => {
  const m = await Membership.findOneAndUpdate({ user: req.params.id }, { status: 'cancelled', expiryDate: new Date() }, { new: true });
  await User.findByIdAndUpdate(req.params.id, { planMonths: 0 });
  await log(`Revoked plan from ${req.params.id}`, req, req.params.id);
  res.json({ success: true, membership: m });
});

// ── Payments ─────────────────────────────────────────────────
export const getPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find().populate('user', 'name email').sort({ date: -1 });
  res.json(payments);
});

export const createPayment = asyncHandler(async (req, res) => {
  const { user, label, amount, status, method } = req.body;
  if (!user || !label || amount == null) throw ApiError.badRequest('user, label and amount are required');
  const p = await Payment.create({ user, label, amount, status: status || 'paid', method: method || 'UPI' });
  await log(`Recorded payment ₹${amount} for ${user}`, req, user);
  res.status(201).json(p);
});

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const p = await Payment.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!p) throw ApiError.notFound('Payment not found');
  res.json(p);
});

// ── Attendance management ────────────────────────────────────
export const markAttendance = asyncHandler(async (req, res) => {
  const { user, date, status, mode, classType, session } = req.body;
  if (!user || !date || !status) throw ApiError.badRequest('user, date and status are required');
  const day = new Date(date); day.setHours(0, 0, 0, 0);
  const record = await Attendance.findOneAndUpdate(
    { user, date: day },
    { user, date: day, status, mode: mode || 'offline', classType: classType || 'General', session: session || null },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  await log(`Marked ${status} for ${user} on ${day.toDateString()}`, req, user);
  res.json(record);
});

export const getStudentAttendance = asyncHandler(async (req, res) => {
  const records = await Attendance.find({ user: req.params.id }).sort({ date: -1 });
  res.json(records);
});

// ── Generic CRUD factory for simple collections ──────────────
function crud(Model, label) {
  return {
    list: asyncHandler(async (req, res) => res.json(await Model.find().sort({ createdAt: -1 }))),
    create: asyncHandler(async (req, res) => {
      const doc = await Model.create(req.body);
      await log(`Created ${label}`, req, null, { id: doc._id });
      res.status(201).json(doc);
    }),
    update: asyncHandler(async (req, res) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
      if (!doc) throw ApiError.notFound(`${label} not found`);
      res.json(doc);
    }),
    remove: asyncHandler(async (req, res) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) throw ApiError.notFound(`${label} not found`);
      await log(`Deleted ${label}`, req, null, { id: req.params.id });
      res.json({ success: true });
    }),
  };
}

export const classes = crud(ClassSession, 'class');
export const workshops = crud(Workshop, 'workshop');
export const downloads = crud(Download, 'download');
export const courses = crud(Course, 'course');
export const plans = crud(Plan, 'plan');
export const coupons = crud(Coupon, 'coupon');

// ── Consultations (admin) ────────────────────────────────────
export const getConsultations = asyncHandler(async (req, res) => {
  res.json(await Consultation.find().populate('user', 'name email').sort({ date: -1 }));
});
export const updateConsultation = asyncHandler(async (req, res) => {
  const { status, meetingLink, notes, doctor, date } = req.body;
  const updates = {};
  ['status', 'meetingLink', 'notes', 'doctor'].forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
  if (date) updates.date = new Date(date);
  const c = await Consultation.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!c) throw ApiError.notFound('Consultation not found');
  res.json(c);
});

// ── Notifications (admin broadcast) ──────────────────────────
export const listNotifications = asyncHandler(async (req, res) => {
  res.json(await Notification.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(200));
});

export const broadcastNotification = asyncHandler(async (req, res) => {
  const { title, message, channels, segment } = req.body;
  if (!message) throw ApiError.badRequest('Message is required');
  const chans = channels?.length ? channels : ['email'];

  if (!segment || segment === 'All') {
    // Single broadcast row visible to everyone.
    const n = await Notification.create({ user: null, title: title || '', message, channels: chans, type: 'system' });
    await log('Broadcast notification to all', req);
    return res.status(201).json({ success: true, sent: 'all', notification: n });
  }

  // Targeted segment: expired members get individual rows.
  const expiredUserIds = await Membership.find({ expiryDate: { $lte: new Date() } }).distinct('user');
  const docs = expiredUserIds.map((u) => ({ user: u, title: title || '', message, channels: chans, type: 'system' }));
  if (docs.length) await Notification.insertMany(docs);
  await User.updateMany({ _id: { $in: expiredUserIds } }, { $inc: { unreadNotifications: 1 } });
  await log(`Broadcast to ${segment} (${docs.length})`, req);
  res.status(201).json({ success: true, sent: docs.length });
});

// ── Settings ─────────────────────────────────────────────────
export const getSettings = asyncHandler(async (req, res) => res.json(await Settings.getSingleton()));
export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSingleton();
  const { announcementBanner, studioName, supportEmail, supportPhone, integrations } = req.body;
  if (announcementBanner !== undefined) settings.announcementBanner = announcementBanner;
  if (studioName !== undefined) settings.studioName = studioName;
  if (supportEmail !== undefined) settings.supportEmail = supportEmail;
  if (supportPhone !== undefined) settings.supportPhone = supportPhone;
  if (integrations) settings.integrations = { ...settings.integrations.toObject(), ...integrations };
  await settings.save();
  res.json(settings);
});

// ── Activity logs ────────────────────────────────────────────
export const getLogs = asyncHandler(async (req, res) => {
  const logs = await ActivityLog.find()
    .populate('performedBy', 'name email')
    .populate('targetUser', 'name email')
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(logs);
});

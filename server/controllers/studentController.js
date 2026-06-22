// ============================================================
// controllers/studentController.js
// All student-facing data + action endpoints. Every handler is
// scoped to the authenticated user (req.user).
// ============================================================
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { buildStudentDashboard } from '../services/dashboardService.js';
import { ensureReferral } from '../services/referralService.js';
import { notify } from '../services/notificationService.js';
import Membership from '../models/Membership.js';
import Attendance from '../models/Attendance.js';
import Payment from '../models/Payment.js';
import ClassSession from '../models/ClassSession.js';
import Workshop from '../models/Workshop.js';
import Download from '../models/Download.js';
import Consultation from '../models/Consultation.js';
import Notification from '../models/Notification.js';
import Referral from '../models/Referral.js';
import Plan from '../models/Plan.js';
import User from '../models/User.js';

const DAY = 86400000;
const PAUSE_RULES = { 1: 0, 3: 15, 6: 30, 12: 60 };

// ── GET /api/student/dashboard ───────────────────────────────
export const getDashboard = asyncHandler(async (req, res) => {
  const data = await buildStudentDashboard(req.user._id);
  if (!data) throw ApiError.notFound('Profile not found');
  res.json(data);
});

// ── Membership ───────────────────────────────────────────────
export const getMembership = asyncHandler(async (req, res) => {
  const m = await Membership.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(m || null);
});

async function recordPayment(userId, label, amount) {
  return Payment.create({ user: userId, label, amount, status: 'paid', method: 'UPI', date: new Date() });
}

export const renewMembership = asyncHandler(async (req, res) => {
  let m = await Membership.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  const months = Number(req.body.planMonths) || m?.planMonths || 1;

  const plan = await Plan.findOne({ durationMonths: months });
  const price = req.body.price ?? plan?.price ?? months * 2000;
  const base = m && m.expiryDate > new Date() ? m.expiryDate.getTime() : Date.now();
  const expiry = new Date(base + months * 30 * DAY);

  if (!m) {
    m = await Membership.create({
      user: req.user._id,
      planType: plan?.name || `${months}-Month Membership`,
      planMonths: months,
      price,
      status: 'active',
      startDate: new Date(),
      expiryDate: expiry,
      pauseDaysAllowed: PAUSE_RULES[months] ?? 0,
      history: [{ action: 'created', planMonths: months }],
    });
  } else {
    m.planMonths = months;
    m.planType = plan?.name || `${months}-Month Membership`;
    m.price = price;
    m.status = 'active';
    m.expiryDate = expiry;
    m.pauseDaysAllowed = PAUSE_RULES[months] ?? m.pauseDaysAllowed;
    m.history.push({ action: 'renewed', planMonths: months });
    await m.save();
  }

  await User.findByIdAndUpdate(req.user._id, { planMonths: months });
  await recordPayment(req.user._id, `${m.planType} (Renewal)`, price);
  await notify(req.user._id, { title: 'Membership renewed', message: `Your ${m.planType} is active until ${expiry.toLocaleDateString('en-IN')}.`, type: 'success' });

  res.json({ success: true, membership: m });
});

export const upgradeMembership = asyncHandler(async (req, res) => {
  const months = Number(req.body.planMonths);
  if (!months || months <= 0) throw ApiError.badRequest('A valid planMonths is required to upgrade');

  let m = await Membership.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  if (!m) throw ApiError.notFound('No active membership to upgrade');

  const plan = await Plan.findOne({ durationMonths: months });
  const price = req.body.price ?? plan?.price ?? months * 2000;
  // Upgrade extends the remaining window to the larger plan length.
  m.expiryDate = new Date(Math.max(m.expiryDate.getTime(), Date.now()) + months * 30 * DAY);
  m.planMonths = months;
  m.planType = plan?.name || `${months}-Month Membership`;
  m.price = price;
  m.status = 'active';
  m.pauseDaysAllowed = PAUSE_RULES[months] ?? m.pauseDaysAllowed;
  m.history.push({ action: 'upgraded', planMonths: months });
  await m.save();

  await User.findByIdAndUpdate(req.user._id, { planMonths: months });
  await recordPayment(req.user._id, `${m.planType} (Upgrade)`, price);
  await notify(req.user._id, { title: 'Membership upgraded', message: `You're now on the ${m.planType}.`, type: 'success' });

  res.json({ success: true, membership: m });
});

export const pauseMembership = asyncHandler(async (req, res) => {
  const m = await Membership.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  if (!m) throw ApiError.notFound('No membership found');
  if (m.status === 'paused') throw ApiError.badRequest('Membership is already paused');

  const days = Math.min(Number(req.body.days) || 7, m.pauseDaysAllowed - m.pauseDaysUsed);
  if (days <= 0) throw ApiError.badRequest('No pause days remaining on this plan');

  m.status = 'paused';
  m.pauseDaysUsed += days;
  m.expiryDate = new Date(m.expiryDate.getTime() + days * DAY); // push expiry out
  m.history.push({ action: 'paused', note: `${days} days` });
  await m.save();

  await notify(req.user._id, { title: 'Membership paused', message: `Your plan is paused for ${days} days.`, type: 'info' });
  res.json({ success: true, membership: m });
});

export const resumeMembership = asyncHandler(async (req, res) => {
  const m = await Membership.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  if (!m) throw ApiError.notFound('No membership found');
  m.status = m.expiryDate > new Date() ? 'active' : 'expired';
  m.history.push({ action: 'resumed' });
  await m.save();
  res.json({ success: true, membership: m });
});

// ── Attendance ───────────────────────────────────────────────
export const getAttendance = asyncHandler(async (req, res) => {
  const records = await Attendance.find({ user: req.user._id }).sort({ date: -1 });
  const counted = records.filter((r) => ['present', 'zoom', 'absent'].includes(r.status));
  const present = records.filter((r) => r.status === 'present' || r.status === 'zoom').length;
  res.json({
    records,
    summary: {
      total: counted.length,
      present,
      absent: records.filter((r) => r.status === 'absent').length,
      zoom: records.filter((r) => r.status === 'zoom').length,
      rate: counted.length ? Math.round((present / counted.length) * 100) : 0,
    },
  });
});

// ── Payments ─────────────────────────────────────────────────
export const getPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id }).sort({ date: -1 });
  res.json(payments);
});

// ── Classes ──────────────────────────────────────────────────
export const getClasses = asyncHandler(async (req, res) => {
  const now = new Date();
  const [upcoming, recordings] = await Promise.all([
    ClassSession.find({ date: { $gte: now }, status: 'upcoming' }).sort({ date: 1 }),
    ClassSession.find({ status: 'completed', recordingUrl: { $ne: '' } }).sort({ date: -1 }),
  ]);
  res.json({ upcoming, recordings });
});

export const enrollClass = asyncHandler(async (req, res) => {
  const session = await ClassSession.findById(req.params.id);
  if (!session) throw ApiError.notFound('Class not found');
  if (session.enrolledUsers.some((id) => id.equals(req.user._id))) {
    return res.json({ success: true, msg: 'Already enrolled' });
  }
  if (session.enrolledUsers.length >= session.capacity) throw ApiError.badRequest('This class is full');

  session.enrolledUsers.push(req.user._id);
  await session.save();
  await notify(req.user._id, { title: 'Class booked', message: `You're enrolled in ${session.name}.`, type: 'class' });
  res.json({ success: true, msg: 'Enrolled successfully' });
});

// ── Workshops ────────────────────────────────────────────────
export const getWorkshopDetail = asyncHandler(async (req, res) => {
  const wk = await Workshop.findById(req.params.id).populate('registrations.user', 'name email');
  if (!wk) throw ApiError.notFound('Workshop not found');

  // Check plan eligibility
  if (wk.allowedPlans && wk.allowedPlans.length > 0) {
    const membership = await Membership.findOne({
      user: req.user._id,
      status: 'active',
      expiryDate: { $gt: new Date() },
    }).sort({ createdAt: -1 });
    const eligible = membership && wk.allowedPlans.some(
      (ap) => ap.toLowerCase() === membership.planType.toLowerCase()
    );
    if (!eligible) throw ApiError.forbidden('Your current membership plan does not have access to this workshop');
  }

  const myReg = wk.registrations.find((r) => r.user && r.user._id.equals(req.user._id));
  const totalRegs = wk.registrations.length;
  const remainingSeats = Math.max(0, wk.capacity - totalRegs);

  // Auto-generate reminder notification if workshop is within 24 hours and student is registered
  if (myReg && wk.date) {
    const now = new Date();
    const workshopStart = new Date(wk.date);
    const hoursUntil = (workshopStart.getTime() - now.getTime()) / 3600000;
    if (hoursUntil > 0 && hoursUntil <= 24) {
      const existingReminder = await Notification.findOne({
        user: req.user._id,
        workshop: wk._id,
        type: 'workshop',
        title: { $regex: /reminder/i },
      });
      if (!existingReminder) {
        await notify(req.user._id, {
          title: 'Reminder: ' + wk.name,
          message: `<strong>${wk.name}</strong> starts ${wk.startTime ? 'at ' + wk.startTime : 'soon'}! Click to join.`,
          type: 'workshop',
          workshop: wk._id,
        });
      }
    }
  }

  res.json({
    id: wk._id,
    _id: wk._id,
    name: wk.name,
    description: wk.description,
    date: wk.date,
    startTime: wk.startTime,
    endTime: wk.endTime,
    duration: wk.duration,
    price: wk.price,
    capacity: wk.capacity,
    instructor: wk.instructor,
    zoomLink: wk.zoomLink,
    image: wk.image,
    registrationDeadline: wk.registrationDeadline,
    isPaid: wk.isPaid,
    allowedPlans: wk.allowedPlans,
    status: wk.status,
    isPublished: wk.isPublished,
    remainingSeats,
    totalRegistrations: totalRegs,
    registered: !!myReg,
    myRegistration: myReg
      ? {
          _id: myReg._id,
          paid: myReg.paid,
          attended: myReg.attended,
          enrolledAt: myReg.at,
          planType: myReg.planType || '',
          planMonths: myReg.planMonths || 0,
          lastJoinTime: myReg.lastJoinTime || null,
        }
      : null,
    createdAt: wk.createdAt,
    updatedAt: wk.updatedAt,
  });
});

export const getWorkshops = asyncHandler(async (req, res) => {
  // Find the student's active membership to determine eligible plan names
  const membership = await Membership.findOne({
    user: req.user._id,
    status: 'active',
    expiryDate: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  const eligiblePlanNames = membership?.planType ? [membership.planType] : [];

  // Fetch all published, non-archived workshops
  const allWorkshops = await Workshop.find({
    isPublished: true,
    archived: { $ne: true },
  }).sort({ date: 1 });

  // Filter workshops: either no allowedPlans restriction, or student's plan matches
  const workshops = allWorkshops.filter((wk) => {
    if (!wk.allowedPlans || wk.allowedPlans.length === 0) return true;
    return eligiblePlanNames.some((pn) =>
      wk.allowedPlans.some((ap) => ap.toLowerCase() === pn.toLowerCase())
    );
  });

  res.json(workshops);
});

export const registerWorkshop = asyncHandler(async (req, res) => {
  const wk = await Workshop.findById(req.params.id);
  if (!wk) throw ApiError.notFound('Workshop not found');

  // Find active membership
  const membership = await Membership.findOne({
    user: req.user._id,
    status: 'active',
    expiryDate: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  // Check plan eligibility
  if (wk.allowedPlans && wk.allowedPlans.length > 0) {
    const eligible = membership && wk.allowedPlans.some(
      (ap) => ap.toLowerCase() === membership.planType.toLowerCase()
    );
    if (!eligible) throw ApiError.forbidden('Your current membership plan does not have access to this workshop');
  }

  if (wk.registrations.some((r) => r.user && r.user.equals(req.user._id))) {
    return res.json({ success: true, msg: 'Already registered' });
  }
  if (wk.registrations.length >= wk.capacity) throw ApiError.badRequest('This workshop is full');

  wk.registrations.push({
    user: req.user._id,
    paid: wk.price > 0,
    planType: membership?.planType || '',
    planMonths: membership?.planMonths || 0,
  });
  await wk.save();
  if (wk.price > 0) await recordPayment(req.user._id, `Workshop: ${wk.name}`, wk.price);
  await notify(req.user._id, {
    title: 'Enrolled: ' + wk.name,
    message: `You're registered for <strong>${wk.name}</strong>. Click to view details.`,
    type: 'workshop',
    workshop: wk._id,
  });
  res.json({ success: true, msg: 'Registered successfully' });
});

// ── Downloads ────────────────────────────────────────────────
export const getDownloads = asyncHandler(async (req, res) => {
  const files = await Download.find({ visibility: { $in: ['all', 'plan'] } }).sort({ createdAt: -1 });
  res.json(files);
});

export const trackDownload = asyncHandler(async (req, res) => {
  await Download.findByIdAndUpdate(req.params.id, { $inc: { downloadCount: 1 } });
  res.json({ success: true });
});

// ── Consultations ────────────────────────────────────────────
export const getConsultations = asyncHandler(async (req, res) => {
  const consultations = await Consultation.find({ user: req.user._id }).sort({ date: -1 });
  res.json(consultations);
});

export const bookConsultation = asyncHandler(async (req, res) => {
  const { date, doctor, topic } = req.body;
  if (!date) throw ApiError.badRequest('A consultation date is required');
  const c = await Consultation.create({
    user: req.user._id,
    date: new Date(date),
    doctor: doctor || 'Pragya Wellness Team',
    topic: topic || 'General consultation',
    status: 'upcoming',
  });
  await notify(req.user._id, { title: 'Consultation booked', message: `Your consultation is scheduled for ${new Date(date).toLocaleDateString('en-IN')}.`, type: 'info' });
  res.status(201).json({ success: true, consultation: c });
});

export const rescheduleConsultation = asyncHandler(async (req, res) => {
  const { date } = req.body;
  if (!date) throw ApiError.badRequest('A new date is required');
  const c = await Consultation.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { date: new Date(date), status: 'upcoming' },
    { new: true }
  );
  if (!c) throw ApiError.notFound('Consultation not found');
  res.json({ success: true, consultation: c });
});

export const cancelConsultation = asyncHandler(async (req, res) => {
  const c = await Consultation.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { status: 'cancelled' },
    { new: true }
  );
  if (!c) throw ApiError.notFound('Consultation not found');
  res.json({ success: true, consultation: c });
});

// ── Notifications ────────────────────────────────────────────
export const getNotifications = asyncHandler(async (req, res) => {
  const notifs = await Notification.find({ $or: [{ user: req.user._id }, { user: null }] }).sort({ createdAt: -1 }).limit(100);
  res.json(notifs);
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const n = await Notification.findOne({ _id: req.params.id, user: req.user._id });
  if (!n) throw ApiError.notFound('Notification not found');
  if (!n.read) {
    n.read = true;
    await n.save();
    await User.findByIdAndUpdate(req.user._id, { $inc: { unreadNotifications: -1 } });
  }
  res.json({ success: true });
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  await User.findByIdAndUpdate(req.user._id, { unreadNotifications: 0 });
  res.json({ success: true });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const n = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!n) throw ApiError.notFound('Notification not found');
  if (!n.read) await User.findByIdAndUpdate(req.user._id, { $inc: { unreadNotifications: -1 } });
  res.json({ success: true });
});

// ── Referral ─────────────────────────────────────────────────
export const getReferral = asyncHandler(async (req, res) => {
  const ref = await ensureReferral(req.user);
  res.json({
    code: ref.code,
    link: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/newuser?ref=${ref.code}`,
    earned: ref.earned,
    invited: ref.invited,
    joined: ref.joined,
    stats: { invited: ref.invited.length, joined: ref.joined.length, earned: ref.earned },
  });
});

export const inviteReferral = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  if (!email) throw ApiError.badRequest('An email to invite is required');
  const ref = await ensureReferral(req.user);
  ref.invited.push({ name: name || '', email });
  await ref.save();
  res.json({ success: true, msg: 'Invitation recorded', stats: { invited: ref.invited.length, joined: ref.joined.length, earned: ref.earned } });
});

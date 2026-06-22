// ============================================================
// services/dashboardService.js
// Assembles the single nested `student` object the React
// dashboard consumes — sourced entirely from MongoDB.
// ============================================================
import Membership from '../models/Membership.js';
import Attendance from '../models/Attendance.js';
import Payment from '../models/Payment.js';
import ClassSession from '../models/ClassSession.js';
import Workshop from '../models/Workshop.js';
import Download from '../models/Download.js';
import Consultation from '../models/Consultation.js';
import Notification from '../models/Notification.js';
import Referral from '../models/Referral.js';
import User from '../models/User.js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const fmtDateTime = (d) =>
  d
    ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true })
    : '—';

const relTime = (d) => {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return fmtDate(d);
};

// Build a calendar-aligned attendance grid for the current month.
function buildAttendanceCalendar(records, now = new Date()) {
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();

  // Map day-of-month -> status for records that fall in this month.
  const byDay = new Map();
  for (const r of records) {
    const rd = new Date(r.date);
    if (rd.getFullYear() === year && rd.getMonth() === month) byDay.set(rd.getDate(), r.status);
  }

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push({ status: 'empty', date: '' });
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = new Date(year, month, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    let status;
    if (byDay.has(d)) status = byDay.get(d);
    else if (d > today) status = 'future';
    else status = 'empty';
    cells.push({ status, date: dateStr });
  }

  const attendanceMonth = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  return { attendanceRecords: cells, attendanceMonth };
}

export async function buildStudentDashboard(userId) {
  const user = await User.findById(userId).lean();
  if (!user) return null;

  const now = new Date();
  const uid = user._id;

  const [
    membership,
    attendanceDocs,
    payments,
    upcomingSessions,
    recordingSessions,
    workshops,
    downloads,
    consultations,
    notifications,
    referral,
  ] = await Promise.all([
    Membership.findOne({ user: uid }).sort({ createdAt: -1 }),
    Attendance.find({ user: uid }).sort({ date: 1 }),
    Payment.find({ user: uid }).sort({ date: -1 }),
    ClassSession.find({ date: { $gte: now }, status: 'upcoming' }).sort({ date: 1 }).limit(20),
    ClassSession.find({ status: 'completed', recordingUrl: { $ne: '' } }).sort({ date: -1 }).limit(20),
    Workshop.find({}).sort({ date: 1 }),
    Download.find({ visibility: { $in: ['all', 'plan'] } }).sort({ createdAt: -1 }),
    Consultation.find({ user: uid }).sort({ date: -1 }),
    Notification.find({ $or: [{ user: uid }, { user: null }] }).sort({ createdAt: -1 }).limit(50),
    Referral.findOne({ user: uid }),
  ]);

  // ── Attendance ──
  const { attendanceRecords, attendanceMonth } = buildAttendanceCalendar(attendanceDocs, now);
  const counted = attendanceDocs.filter((r) => ['present', 'zoom', 'absent'].includes(r.status));
  const presentCnt = attendanceDocs.filter((r) => r.status === 'present' || r.status === 'zoom').length;
  const attendancePct = counted.length ? Math.round((presentCnt / counted.length) * 100) : 0;

  // ── Membership ──
  const planActive = membership ? membership.status === 'active' && membership.expiryDate > now : false;
  const daysLeft = membership ? Math.max(0, Math.ceil((membership.expiryDate - now) / 86400000)) : 0;

  // ── Classes ──
  const upcoming = upcomingSessions.map((c) => ({
    id: c._id,
    time: c.time || fmtDateTime(c.date),
    name: c.name,
    mode: c.mode,
    zoomUrl: c.zoomUrl,
    enrolled: c.enrolledUsers.some((id) => id.equals(uid)),
  }));
  const recordings = recordingSessions.map((c) => ({
    date: fmtDate(c.date),
    name: c.name,
    url: c.recordingUrl,
  }));

  // ── Workshops ──
  const eligiblePlanNames = membership?.planType ? [membership.planType] : [];
  const registered = [];
  const available = [];
  for (const wk of workshops) {
    // Skip workshops not published or archived
    if (!wk.isPublished || wk.archived) continue;

    // Check plan eligibility: if allowedPlans is non-empty, user's plan must match
    if (wk.allowedPlans && wk.allowedPlans.length > 0) {
      const planMatch = eligiblePlanNames.some((pn) =>
        wk.allowedPlans.some((ap) => ap.toLowerCase() === pn.toLowerCase())
      );
      if (!planMatch) continue;
    }

    const totalRegs = wk.registrations.length;
    const remainingSeats = Math.max(0, wk.capacity - totalRegs);
    const fmtTime = (t) => t || '';
    const workshopObj = {
      id: wk._id,
      _id: wk._id,
      date: fmtDate(wk.date),
      startTime: fmtTime(wk.startTime),
      endTime: fmtTime(wk.endTime),
      name: wk.name,
      duration: wk.duration,
      price: wk.price,
      description: wk.description || '',
      instructor: wk.instructor || '',
      zoomLink: wk.zoomLink || '',
      image: wk.image || '',
      capacity: wk.capacity,
      totalRegistrations: totalRegs,
      remainingSeats,
      isPaid: wk.isPaid,
      allowedPlans: wk.allowedPlans || [],
      status: wk.status || 'available',
    };

    const reg = wk.registrations.find((r) => r.user && r.user.equals(uid));
    if (reg) {
      registered.push({
        ...workshopObj,
        paid: reg.paid,
        attended: reg.attended,
        enrolledAt: reg.at,
        planType: reg.planType || '',
        planMonths: reg.planMonths || 0,
        lastJoinTime: reg.lastJoinTime || null,
      });
    } else if (wk.status === 'available' && wk.date >= now) {
      available.push(workshopObj);
    }
  }

  // ── Consultations ──
  const consUpcoming = consultations
    .filter((c) => c.status === 'upcoming')
    .map((c) => ({ id: c._id, date: fmtDateTime(c.date), doctor: c.doctor, topic: c.topic, zoomUrl: c.meetingLink }));
  const consPast = consultations
    .filter((c) => c.status === 'completed')
    .map((c) => ({ id: c._id, date: fmtDate(c.date), doctor: c.doctor, topic: c.topic }));

  // ── Referral ──
  const referralCode = referral?.code || '';
  const referralLink = referralCode ? `${FRONTEND_URL}/newuser?ref=${referralCode}` : '';
  const referralStats = {
    invited: referral?.invited?.length || 0,
    joined: referral?.joined?.length || 0,
    earned: referral?.earned || 0,
  };

  const unreadCount = notifications.filter((n) => !n.read && n.user).length;

  return {
    // identity / profile
    id: user._id,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    city: user.city || '',
    style: user.style || '',
    level: user.level || '',
    avatar: user.avatar || '',
    badges: user.badges || [],
    progress: user.progress || { flexibility: 0, strength: 0, breathing: 0, meditation: 0 },

    // membership
    planMonths: membership?.planMonths ?? user.planMonths ?? 0,
    planType: membership?.planType || '',
    planStart: membership ? fmtDate(membership.startDate) : '—',
    planExpiry: membership ? fmtDate(membership.expiryDate) : '—',
    daysLeft,
    planActive,
    zoomAccess: membership?.zoomAccess ?? false,
    benefits: membership?.benefits || [],

    // stats
    stats: { classes: presentCnt, attendancePct },
    referralCount: referralStats.joined,
    unreadNotifications: unreadCount,

    // collections
    attendanceRecords,
    attendanceMonth,
    payments: payments.map((p) => ({ label: p.label, amount: p.amount, status: p.status, receiptUrl: p.receiptUrl })),
    classes: { upcoming, recordings },
    workshops: { registered, available },
    consultations: { upcoming: consUpcoming, past: consPast },
    downloads: downloads.map((d) => ({ type: d.type, name: d.name, size: d.size, url: d.url })),
    notifications: notifications.map((n) => ({
      message: n.title ? `<strong>${n.title}</strong> — ${n.message}` : n.message,
      unread: !n.read,
      time: relTime(n.createdAt),
      channels: n.channels,
    })),

    // referral
    referralCode,
    referralLink,
    referralStats,
  };
}

export default buildStudentDashboard;

// ============================================================
// routes/student.js  —  mounted at /api/student
// Every route requires an authenticated student/admin session.
// ============================================================
import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as s from '../controllers/studentController.js';
import * as assetCtrl from '../controllers/assetController.js';

const router = express.Router();
router.use(requireAuth);

router.get('/dashboard', s.getDashboard);

// Membership
router.get('/membership', s.getMembership);
router.post('/membership/renew', s.renewMembership);
router.post('/membership/upgrade', s.upgradeMembership);
router.post('/membership/pause', s.pauseMembership);
router.post('/membership/resume', s.resumeMembership);

// Attendance & payments
router.get('/attendance', s.getAttendance);
router.get('/payments', s.getPayments);

// Classes
router.get('/classes', s.getClasses);
router.post('/classes/:id/enroll', s.enrollClass);

// Workshops
router.get('/workshops', s.getWorkshops);
router.get('/workshops/:id', s.getWorkshopDetail);
router.post('/workshops/:id/register', s.registerWorkshop);

// Downloads / Assets
router.get('/downloads', assetCtrl.getStudentAssets);
router.post('/downloads/:id/track', s.trackDownload);
router.get('/downloads/:id/download', assetCtrl.downloadAsset);

// Consultations
router.get('/consultations', s.getConsultations);
router.post('/consultations', s.bookConsultation);
router.patch('/consultations/:id/reschedule', s.rescheduleConsultation);
router.patch('/consultations/:id/cancel', s.cancelConsultation);

// Notifications
router.get('/notifications', s.getNotifications);
router.patch('/notifications/read-all', s.markAllNotificationsRead);
router.patch('/notifications/:id/read', s.markNotificationRead);
router.delete('/notifications/:id', s.deleteNotification);

// Referral
router.get('/referral', s.getReferral);
router.post('/referral/invite', s.inviteReferral);

export default router;

// ============================================================
// routes/admin.js  —  mounted at /api/admin
// All routes require an authenticated admin.
// ============================================================
import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import * as a from '../controllers/adminController.js';
import * as assetCtrl from '../controllers/assetController.js';
import upload from '../middleware/upload.js';

const router = express.Router();
router.use(requireAuth, requireAdmin);

// Overview & analytics
router.get('/overview', a.getOverview);
router.get('/analytics/revenue', a.getRevenueAnalytics);
router.get('/logs', a.getLogs);

// Students
router.get('/students', a.getStudents);
router.post('/students', a.createStudent);
router.get('/students/:id', a.getStudentById);
router.put('/students/:id', a.updateStudent);
router.delete('/students/:id', a.deleteStudent);
router.patch('/students/:id/status', a.setStudentStatus);
router.get('/students/:id/logs', a.getStudentLogs);

// Plans assignment
router.post('/plans/assign', a.assignPlan);
router.put('/plans/revoke/:id', a.revokePlan);

// Memberships renew & upgrade
router.post('/memberships/renew', a.renewMembership);
router.post('/memberships/upgrade', a.upgradeMembership);

// Payments
router.get('/payments', a.getPayments);
router.post('/payments', a.createPayment);
router.patch('/payments/:id/status', a.updatePaymentStatus);

// Attendance
router.post('/attendance', a.markAttendance);
router.get('/attendance/:id', a.getStudentAttendance);

// Classes
router.get('/classes', a.classes.list);
router.post('/classes', a.classes.create);
router.put('/classes/:id', a.classes.update);
router.delete('/classes/:id', a.classes.remove);

// Workshops (custom admin handlers)
router.get('/workshops', a.adminGetWorkshops);
router.post('/workshops', a.adminCreateWorkshop);
router.put('/workshops/:id', a.adminUpdateWorkshop);
router.delete('/workshops/:id', a.adminDeleteWorkshop);
router.patch('/workshops/:id/publish', a.adminTogglePublish);
router.patch('/workshops/:id/archive', a.adminToggleArchive);
router.get('/workshops/:id/stats', a.adminGetWorkshopStats);
router.get('/workshops/:id/registrations', a.adminGetWorkshopRegistrations);
router.patch('/workshops/:id/attendance', a.adminMarkAttendance);

// ── Assets / Content Management ──────────────────────────────
router.get('/downloads', assetCtrl.listAssets);
router.post('/downloads/upload', upload.single('file'), assetCtrl.uploadAsset);
router.get('/downloads/stats', assetCtrl.getAssetStats);
router.get('/downloads/:id', assetCtrl.getAsset);
router.put('/downloads/:id', assetCtrl.updateAsset);
router.post('/downloads/:id/replace', upload.single('file'), assetCtrl.replaceAssetFile);
router.patch('/downloads/:id/archive', assetCtrl.archiveAsset);
router.delete('/downloads/:id', assetCtrl.deleteAsset);
router.get('/downloads/:id/download', assetCtrl.downloadAsset);

// Courses
router.get('/courses', a.courses.list);
router.post('/courses', a.courses.create);
router.put('/courses/:id', a.courses.update);
router.delete('/courses/:id', a.courses.remove);

// Membership plans catalogue
router.get('/membership-plans', a.plans.list);
router.post('/membership-plans', a.plans.create);
router.put('/membership-plans/:id', a.plans.update);
router.delete('/membership-plans/:id', a.plans.remove);

// Coupons
router.get('/coupons', a.coupons.list);
router.post('/coupons', a.coupons.create);
router.put('/coupons/:id', a.coupons.update);
router.delete('/coupons/:id', a.coupons.remove);

// Consultations
router.get('/consultations', a.getConsultations);
router.put('/consultations/:id', a.updateConsultation);

// Notifications
router.get('/notifications', a.listNotifications);
router.post('/notifications/broadcast', a.broadcastNotification);

// Settings
router.get('/settings', a.getSettings);
router.put('/settings', a.updateSettings);

export default router;

// ============================================================
// routes/admin.js  —  mounted at /api/admin
// All routes require an authenticated admin.
// ============================================================
import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import * as a from '../controllers/adminController.js';

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

// Workshops
router.get('/workshops', a.workshops.list);
router.post('/workshops', a.workshops.create);
router.put('/workshops/:id', a.workshops.update);
router.delete('/workshops/:id', a.workshops.remove);

// Downloads / content
router.get('/downloads', a.downloads.list);
router.post('/downloads', a.downloads.create);
router.put('/downloads/:id', a.downloads.update);
router.delete('/downloads/:id', a.downloads.remove);

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

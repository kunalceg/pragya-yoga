// ============================================================
// routes/public.js  —  mounted at /api/public
// Unauthenticated read-only catalogue data for the marketing
// site (courses, plans, batches, settings banner).
// ============================================================
import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import Course from '../models/Course.js';
import Plan from '../models/Plan.js';
import Batch from '../models/Batch.js';
import Workshop from '../models/Workshop.js';
import Settings from '../models/Settings.js';

const router = express.Router();

router.get('/courses', asyncHandler(async (req, res) => res.json(await Course.find({ active: true }))));
router.get('/plans', asyncHandler(async (req, res) => res.json(await Plan.find({ active: true }).sort({ displayOrder: 1 }))));
router.get('/batches', asyncHandler(async (req, res) => res.json(await Batch.find({ status: { $ne: 'Closed' } }).sort({ createdAt: -1 }))));
router.get('/workshops', asyncHandler(async (req, res) => res.json(await Workshop.find({ status: 'available', date: { $gte: new Date() } }).sort({ date: 1 }))));
router.get('/settings', asyncHandler(async (req, res) => {
  const s = await Settings.getSingleton();
  res.json({ announcementBanner: s.announcementBanner, studioName: s.studioName, supportEmail: s.supportEmail, supportPhone: s.supportPhone });
}));

export default router;

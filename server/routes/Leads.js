// ============================================================
// routes/leads.js  —  mounted at /api/leads
// Public create (contact / enquiry forms); admin manage pipeline.
// ============================================================
import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Lead from '../models/Lead.js';

const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
  const { name, phone, email, interestType, notes } = req.body;
  if (!name) throw ApiError.badRequest('Name is required');
  const lead = await Lead.create({ name, phone, email, interestType, notes, stage: 'New' });
  res.status(201).json(lead);
}));

router.get('/', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  res.json(await Lead.find().sort({ createdAt: -1 }));
}));

router.patch('/:id/stage', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const { stage } = req.body;
  if (!['New', 'Follow up', 'Converted', 'Cold'].includes(stage)) throw ApiError.badRequest('Invalid stage');
  const updated = await Lead.findByIdAndUpdate(req.params.id, { stage }, { new: true });
  if (!updated) throw ApiError.notFound('Lead not found');
  res.json(updated);
}));

router.delete('/:id', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const deleted = await Lead.findByIdAndDelete(req.params.id);
  if (!deleted) throw ApiError.notFound('Lead not found');
  res.json({ success: true, msg: 'Lead deleted' });
}));

export default router;

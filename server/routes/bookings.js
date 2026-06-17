// ============================================================
// routes/bookings.js  —  mounted at /api/bookings
// Public create (from the payment page); admin manage.
// ============================================================
import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Booking from '../models/Booking.js';

const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
  const { name, email, phone, city, courseName, coursePrice, courseTime, paymentMethod, transactionId, message } = req.body;
  if (!name || !email || !phone || !courseName || !coursePrice) {
    throw ApiError.badRequest('Name, email, phone, course name and price are required');
  }
  const booking = await Booking.create({
    name, email, phone, city: city || '',
    courseName, coursePrice: String(coursePrice), courseTime: courseTime || '',
    paymentMethod: paymentMethod || 'UPI', transactionId: transactionId || '', message: message || '',
    status: 'Pending',
  });
  res.status(201).json({ success: true, message: 'Booking confirmed!', booking });
}));

router.get('/', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  res.json(await Booking.find().sort({ createdAt: -1 }));
}));

router.patch('/:id/status', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) throw ApiError.badRequest('Invalid status');
  const updated = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!updated) throw ApiError.notFound('Booking not found');
  res.json(updated);
}));

router.delete('/:id', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const deleted = await Booking.findByIdAndDelete(req.params.id);
  if (!deleted) throw ApiError.notFound('Booking not found');
  res.json({ success: true, msg: 'Booking deleted' });
}));

export default router;

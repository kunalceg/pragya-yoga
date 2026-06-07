import express from 'express';
import Booking from '../models/Booking.js';

const router = express.Router();

// POST /api/bookings — create new booking
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, city, courseName, coursePrice, courseTime, paymentMethod, transactionId, message } = req.body;

    if (!name || !email || !phone || !courseName || !coursePrice) {
      return res.status(400).json({ message: 'Name, email, phone, course name and price are required.' });
    }

    const booking = new Booking({
      name, email, phone, city: city || '',
      courseName, coursePrice, courseTime: courseTime || '',
      paymentMethod: paymentMethod || 'UPI',
      transactionId: transactionId || '',
      message: message || '',
      status: 'Pending',
    });

    await booking.save();
    res.status(201).json({ message: 'Booking confirmed!', booking });
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ message: 'Failed to save booking.' });
  }
});

// GET /api/bookings — fetch all bookings (admin)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    console.error('Fetch bookings error:', err);
    res.status(500).json({ message: 'Failed to fetch bookings.' });
  }
});

// PATCH /api/bookings/:id/status — update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Booking not found.' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status.' });
  }
});

// DELETE /api/bookings/:id
router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Booking deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete booking.' });
  }
});

export default router;

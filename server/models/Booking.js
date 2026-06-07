import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    // Student details
    name:    { type: String, required: true },
    email:   { type: String, required: true },
    phone:   { type: String, required: true },
    city:    { type: String, default: '' },

    // Course details (auto-filled from Book Now)
    courseName:  { type: String, required: true },
    coursePrice: { type: String, required: true },
    courseTime:  { type: String, default: '' },

    // Payment
    paymentMethod: { type: String, enum: ['UPI', 'Bank Transfer', 'Cash', 'Card'], default: 'UPI' },
    transactionId: { type: String, default: '' },
    status:        { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },

    // Notes
    message: { type: String, default: '' },
  },
  { timestamps: true }
);

const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
export default Booking;

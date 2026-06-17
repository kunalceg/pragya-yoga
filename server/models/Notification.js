import mongoose from 'mongoose';

// user === null  → broadcast notification visible to every student.
const NotificationSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    title:    { type: String, default: '' },
    message:  { type: String, required: true },        // may contain inline HTML
    type:     { type: String, enum: ['info', 'success', 'warning', 'payment', 'class', 'system'], default: 'info' },
    read:     { type: Boolean, default: false, index: true },
    channels: { type: [String], default: ['email'] },  // whatsapp | email | sms
  },
  { timestamps: true }
);

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
export default Notification;

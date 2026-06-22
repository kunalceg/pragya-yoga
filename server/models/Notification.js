import mongoose from 'mongoose';

// user === null  → broadcast notification visible to every student.
const NotificationSchema = new mongoose.Schema(
  {
    user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    title:     { type: String, default: '' },
    message:   { type: String, required: true },        // may contain inline HTML
    type:      { type: String, enum: ['info', 'success', 'warning', 'payment', 'class', 'system', 'new_asset', 'asset_updated', 'asset_replaced', 'workshop'], default: 'info' },
    read:      { type: Boolean, default: false, index: true },
    channels:  { type: [String], default: ['email'] },  // whatsapp | email | sms
    workshop:  { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop', default: null },
    asset:     { type: mongoose.Schema.Types.ObjectId, ref: 'Download', default: null },
    assetName: { type: String, default: '' },
    category:  { type: String, default: '' },
    link:      { type: String, default: '' },
  },
  { timestamps: true }
);

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
export default Notification;

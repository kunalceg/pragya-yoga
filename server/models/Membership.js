import mongoose from 'mongoose';

// One active membership per user (plus historical, expired ones).
const MembershipSchema = new mongoose.Schema(
  {
    user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    planType:   { type: String, default: 'Monthly Pass' },
    planMonths: { type: Number, default: 1 },
    price:      { type: Number, default: 0 },

    status: { type: String, enum: ['active', 'expired', 'paused', 'cancelled'], default: 'active', index: true },

    startDate:  { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },

    zoomAccess: { type: Boolean, default: true },
    benefits:   { type: [String], default: ['Unlimited live classes', 'Zoom access', 'Recorded sessions'] },

    pauseDaysAllowed: { type: Number, default: 0 },
    pauseDaysUsed:    { type: Number, default: 0 },

    history: [
      {
        action:    { type: String }, // created | renewed | upgraded | paused | resumed | cancelled
        planMonths: Number,
        note:      String,
        at:        { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Virtual: days remaining until expiry (never negative).
MembershipSchema.virtual('daysLeft').get(function () {
  const ms = this.expiryDate - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
});

MembershipSchema.virtual('isActive').get(function () {
  return this.status === 'active' && this.expiryDate > new Date();
});

MembershipSchema.set('toJSON', { virtuals: true });
MembershipSchema.set('toObject', { virtuals: true });

const Membership = mongoose.models.Membership || mongoose.model('Membership', MembershipSchema);
export default Membership;

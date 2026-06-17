import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema(
  {
    code:         { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    discountType: { type: String, enum: ['Percentage', 'Flat'], default: 'Percentage' },
    value:        { type: Number, required: true, min: 0 },
    isReferral:   { type: Boolean, default: false },
    active:       { type: Boolean, default: true },
    usageCount:   { type: Number, default: 0 },
    expiresAt:    { type: Date, default: null },
  },
  { timestamps: true }
);

const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
export default Coupon;

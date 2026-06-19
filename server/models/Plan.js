import mongoose from 'mongoose';

const PlanSchema = new mongoose.Schema(
  {
    name:              { type: String, required: true },   // e.g. "Quarterly Pass"
    price:             { type: Number, default: 0 },
    durationMonths:    { type: Number, required: true },
    benefits:          { type: [String], default: [] },
    features:          { type: [String], default: [] },
    membershipAccess:  { type: String, default: 'Full studio access' },
    pauseDays:         { type: Number, default: 0 },
    active:            { type: Boolean, default: true },
    displayOrder:      { type: Number, default: 0 },
    isPopular:         { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Plan = mongoose.models.Plan || mongoose.model('Plan', PlanSchema);
export default Plan;

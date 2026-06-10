import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true },
    phone:        { type: String, default: '' },
    email:        { type: String, default: '' },
    interestType: { type: String, default: 'General Yoga' },
    stage:        { type: String, enum: ['New', 'Follow up', 'Converted', 'Cold'], default: 'New' },
    notes:        { type: String, default: '' },
  },
  { timestamps: true }
);

const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
export default Lead;

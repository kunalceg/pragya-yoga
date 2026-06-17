import mongoose from 'mongoose';

const WorkshopSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    date:     { type: Date, required: true, index: true },
    duration: { type: String, default: '' },     // e.g. "2 hours"
    price:    { type: Number, default: 0 },
    capacity: { type: Number, default: 50 },
    instructor: { type: String, default: '' },
    description: { type: String, default: '' },

    status: { type: String, enum: ['available', 'completed', 'cancelled'], default: 'available', index: true },

    registrations: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        paid: { type: Boolean, default: false },
        at:   { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Workshop = mongoose.models.Workshop || mongoose.model('Workshop', WorkshopSchema);
export default Workshop;

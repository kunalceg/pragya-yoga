import mongoose from 'mongoose';

const BatchSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    timing:   { type: String, required: true },
    trainer:  { type: String, required: true },
    zoomLink: { type: String, default: '' },
    status:   { type: String, enum: ['Active', 'Upcoming', 'Closed'], default: 'Active' },
  },
  { timestamps: true }
);

const Batch = mongoose.models.Batch || mongoose.model('Batch', BatchSchema);
export default Batch;
import mongoose from 'mongoose';

const ConsultationSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date:    { type: Date, required: true },
    doctor:  { type: String, required: true },        // instructor / specialist
    topic:   { type: String, default: 'General consultation' },
    status:  { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming', index: true },
    meetingLink: { type: String, default: '' },       // surfaced to the UI as zoomUrl
    notes:   { type: String, default: '' },
  },
  { timestamps: true }
);

const Consultation = mongoose.models.Consultation || mongoose.model('Consultation', ConsultationSchema);
export default Consultation;

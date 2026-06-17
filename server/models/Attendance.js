import mongoose from 'mongoose';

// One document per student per attended (or missed) day.
const AttendanceSchema = new mongoose.Schema(
  {
    user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date:      { type: Date, required: true },
    status:    { type: String, enum: ['present', 'zoom', 'absent'], required: true },
    classType: { type: String, default: 'General' },
    mode:      { type: String, enum: ['online', 'offline'], default: 'offline' },
    session:   { type: mongoose.Schema.Types.ObjectId, ref: 'ClassSession', default: null },
    notes:     { type: String, default: '' },
  },
  { timestamps: true }
);

// A student can only have one attendance record per calendar day.
AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
export default Attendance;

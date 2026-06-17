import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    duration:    { type: String, default: '' },     // e.g. "3 Weeks"
    mode:        { type: String, enum: ['Online', 'Hybrid', 'Studio'], default: 'Online' },
    price:       { type: Number, default: 0 },
    description: { type: String, default: '' },
    active:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
export default Course;

const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { 
      type: String, 
      enum: ["student", "admin"], // Prevents accidental typing mistakes
      default: "student"         // Automatically makes every registration a student by default
    },
  phone: { type: String },
  city: { type: String },
  style: { type: String, default: 'Hatha' }, // Yoga style preference
  level: { type: String, default: 'Beginner' }, // Beginner, Intermediate, Advanced
  planMonths: { type: Number, default: 1 },
  referralCount: { type: Number, default: 0 },
  stats: {
    classes: { type: Number, default: 0 },
    attendancePct: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
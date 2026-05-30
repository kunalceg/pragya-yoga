const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // Basic user info
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // ── 🎯 CHANGER IDENTIFIER ROLE NODE ──
    // This dictates whether the system serves the Student Dashboard or the YogaAdmin Panel
    role: { 
      type: String, 
      enum: ["student", "admin"], // Prevents accidental typing mistakes
      default: "student"         // Automatically makes every registration a student by default
    },

    // ── Extended profile fields ──
    phone: { type: String, default: "" },
    city: { type: String, default: "" },
    style: { type: String, default: "" }, // e.g. Hatha, Vinyasa, Ashtanga
    level: { type: String, default: "" }, // e.g. Beginner, Intermediate, Advanced

    // ── Plan & stats (for dashboard metrics) ──
    planMonths: { type: Number, default: 0 },
    referralCount: { type: Number, default: 0 },
    stats: {
      classes: { type: Number, default: 0 },
      attendancePct: { type: Number, default: 0 },
    },

    // Yoga student fields
    months: { type: Number, default: 0 },
    certifs: { type: Number, default: 0 },

    progress: {
      flexibility: { type: Number, default: 0 },
      strength: { type: Number, default: 0 },
      breathing: { type: Number, default: 0 },
      meditation: { type: Number, default: 0 },
    },

    // ── Notifications ──
    unreadNotifications: { type: Number, default: 0 },

    badges: { type: [String], default: [] },
  },
  { 
    // 🚀 FIXED: Timestamps must live in their own options configuration object as the 2nd parameter
    timestamps: true 
  }
);

// ✅ Checks if the 'User' model is already compiled to avoid OverwriteModelError.
module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
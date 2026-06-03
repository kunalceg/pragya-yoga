import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    // Basic user info
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Role: Determines if the user is a student or admin
    role: { 
      type: String, 
      enum: ["student", "admin"], 
      default: "student"         
    },

    // Extended profile fields
    phone: { type: String, default: "" },
    city: { type: String, default: "" },
    style: { type: String, default: "" }, 
    level: { type: String, default: "" },

    // Plan & stats
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

    // Notifications
    unreadNotifications: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
  },
  { 
    timestamps: true 
  }
);

// Use the ES Module export syntax
const User = mongoose.models.User || mongoose.model("User", UserSchema, "User");

export default User;
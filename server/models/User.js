import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    // ── Basic identity ──
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true },

    // ── Access control ──
    role:   { type: String, enum: ['student', 'admin'], default: 'student', index: true },
    status: { type: String, enum: ['active', 'banned', 'pending'], default: 'active', index: true },

    // ── Profile ──
    phone:  { type: String, default: '' },
    city:   { type: String, default: '' },
    style:  { type: String, default: 'Hatha' },
    level:  { type: String, default: 'Beginner' },
    avatar: { type: String, default: '' },
    bio:    { type: String, default: '' },

    // ── Cached / denormalised counters (kept in sync by services) ──
    planMonths:          { type: Number, default: 0 },
    referralCount:       { type: Number, default: 0 },
    unreadNotifications: { type: Number, default: 0 },
    months:              { type: Number, default: 0 },
    certifs:             { type: Number, default: 0 },

    stats: {
      classes:       { type: Number, default: 0 },
      attendancePct: { type: Number, default: 0 },
    },

    progress: {
      flexibility: { type: Number, default: 0 },
      strength:    { type: Number, default: 0 },
      breathing:   { type: Number, default: 0 },
      meditation:  { type: Number, default: 0 },
    },

    badges:    { type: [String], default: [] },
    lastLogin: { type: Date, default: null },

    // ── Refresh-token rotation (hashed sessions) ──
    refreshTokens: { type: [String], default: [], select: false },

    // ── Password reset ──
    resetTokenHash:    { type: String, default: null, select: false },
    resetTokenExpires: { type: Date, default: null, select: false },
  },
  { timestamps: true }
);

// Never leak sensitive fields when serialised to JSON.
UserSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.password;
    delete ret.refreshTokens;
    delete ret.resetTokenHash;
    delete ret.resetTokenExpires;
    return ret;
  },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema, 'User');
export default User;

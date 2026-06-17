// ============================================================
// services/referralService.js
// Unique referral-code generation + credit handling.
// ============================================================
import crypto from 'crypto';
import Referral from '../models/Referral.js';
import User from '../models/User.js';

const REWARD_PER_JOIN = Number(process.env.REFERRAL_REWARD || 500);

export async function generateUniqueCode(name = '') {
  const prefix = (name.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase() || 'YOGA');
  // Loop until the random suffix yields a code not already taken.
  for (let i = 0; i < 10; i++) {
    const code = `${prefix}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    const exists = await Referral.exists({ code });
    if (!exists) return code;
  }
  return `${prefix}${Date.now().toString(36).toUpperCase()}`;
}

// Ensure a user has a referral record; returns it.
export async function ensureReferral(user) {
  let ref = await Referral.findOne({ user: user._id });
  if (!ref) {
    const code = await generateUniqueCode(user.name);
    ref = await Referral.create({ user: user._id, code });
  }
  return ref;
}

// Credit the owner of `code` for a newly-joined user.
export async function applyReferral(code, newUser) {
  if (!code) return;
  const ref = await Referral.findOne({ code: code.trim() });
  if (!ref || ref.user.equals(newUser._id)) return;

  ref.joined.push({ user: newUser._id, name: newUser.name, reward: REWARD_PER_JOIN });
  ref.earned += REWARD_PER_JOIN;
  await ref.save();

  await User.findByIdAndUpdate(ref.user, { $inc: { referralCount: 1 } });
}

export default { generateUniqueCode, ensureReferral, applyReferral };

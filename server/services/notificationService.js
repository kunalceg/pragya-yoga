// ============================================================
// services/notificationService.js
// Helper to create notifications and keep the user's unread
// counter in sync.
// ============================================================
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Membership from '../models/Membership.js';

export async function notify(userId, { title = '', message, type = 'info', channels = ['email'], asset, assetName, category, link, workshop }) {
  const n = await Notification.create({ user: userId, title, message, type, channels, asset, assetName, category, link, workshop });
  if (userId) await User.findByIdAndUpdate(userId, { $inc: { unreadNotifications: 1 } });
  return n;
}

// Notify every student who has an active membership matching any of the given plan names.
// Pass an empty planNames array to notify ALL active students (visibility: 'all').
export async function notifyPlanMembers(planNames, { title, message, type = 'new_asset', channels = ['email'], asset, assetName, category, link, workshop }) {
  if (!planNames) { console.log('[notifyPlanMembers] skipped – planNames is null/undefined'); return []; }

  console.log(`[notifyPlanMembers] planNames=${JSON.stringify(planNames)} title="${title}"`);
  const activeMemberships = await Membership.find({
    status: 'active',
    expiryDate: { $gt: new Date() },
  }).populate('user', '_id');
  console.log(`[notifyPlanMembers] found ${activeMemberships.length} active memberships`);

  const now = new Date();
  const userIds = new Set();
  for (const m of activeMemberships) {
    if (!m.user) { console.log('[notifyPlanMembers] skipping membership with no user'); continue; }
    const planMatch = planNames.length === 0 || planNames.some((pn) => {
      const pl = pn.toLowerCase();
      const mt = m.planType.toLowerCase();
      return mt.includes(pl) || pl.includes(mt);
    });
    console.log(`[notifyPlanMembers] membership planType="${m.planType}" planMatch=${planMatch} expired=${!(m.expiryDate > now)}`);
    if (planMatch && m.expiryDate > now) {
      userIds.add(m.user._id.toString());
    }
  }

  console.log(`[notifyPlanMembers] matched ${userIds.size} unique users`);
  if (userIds.size === 0) return [];

  const notifications = [];
  for (const uid of userIds) {
    console.log(`[notifyPlanMembers] creating notification for user ${uid}`);
    const n = await Notification.create({
      user: uid, title, message, type, channels, asset, assetName, category, link, workshop,
    });
    await User.findByIdAndUpdate(uid, { $inc: { unreadNotifications: 1 } });
    notifications.push(n);
  }
  console.log(`[notifyPlanMembers] done – created ${notifications.length} notifications`);
  return notifications;
}

export default { notify, notifyPlanMembers };

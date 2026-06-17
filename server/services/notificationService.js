// ============================================================
// services/notificationService.js
// Helper to create notifications and keep the user's unread
// counter in sync.
// ============================================================
import Notification from '../models/Notification.js';
import User from '../models/User.js';

export async function notify(userId, { title = '', message, type = 'info', channels = ['email'] }) {
  const n = await Notification.create({ user: userId, title, message, type, channels });
  if (userId) await User.findByIdAndUpdate(userId, { $inc: { unreadNotifications: 1 } });
  return n;
}

export default { notify };

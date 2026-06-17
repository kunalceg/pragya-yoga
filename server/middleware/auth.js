// ============================================================
// middleware/auth.js
// JWT authentication + role-based authorization.
//   requireAuth  — verifies the access token, loads req.user
//   requireAdmin — must run after requireAuth; enforces admin role
//   requireRole  — generic role guard factory
// ============================================================
import { verifyAccessToken } from '../utils/token.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.header('Authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw ApiError.unauthorized('No token, authorization denied');

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      throw ApiError.unauthorized(
        err.name === 'TokenExpiredError' ? 'Session expired, please sign in again' : 'Invalid token'
      );
    }

    // Load the live user so role/ban changes take effect immediately.
    const user = await User.findById(decoded.id).select('-password');
    if (!user) throw ApiError.unauthorized('Account no longer exists');
    if (user.status === 'banned') throw ApiError.forbidden('Your account has been suspended');

    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    next(err);
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Access denied. Insufficient privileges.'));
    }
    next();
  };
}

export const requireAdmin = requireRole('admin');

export default requireAuth;

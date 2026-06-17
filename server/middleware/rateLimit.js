// ============================================================
// middleware/rateLimit.js
// Lightweight in-memory rate limiter (no extra dependency).
// Suitable for a single-instance API; swap for a Redis-backed
// limiter when scaling horizontally.
// ============================================================
import ApiError from '../utils/ApiError.js';

export function rateLimit({ windowMs = 15 * 60 * 1000, max = 100, message } = {}) {
  const hits = new Map(); // key -> { count, resetAt }

  // Periodically purge expired buckets so the map doesn't grow unbounded.
  const sweep = setInterval(() => {
    const now = Date.now();
    for (const [key, v] of hits) if (v.resetAt <= now) hits.delete(key);
  }, windowMs);
  sweep.unref?.();

  return (req, res, next) => {
    const now = Date.now();
    const key = `${req.ip}:${req.baseUrl}${req.path}`;
    let bucket = hits.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      hits.set(key, bucket);
    }
    bucket.count += 1;

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - bucket.count));

    if (bucket.count > max) {
      return next(new ApiError(429, message || 'Too many requests, please try again later.'));
    }
    next();
  };
}

export default rateLimit;

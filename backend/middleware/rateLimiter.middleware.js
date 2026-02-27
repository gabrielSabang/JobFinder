import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '../config/redis.js';

const createRatelimiter = (tokens, window) => {
  return new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    ephemeralCache: new Map(), 
  });
};

export const messageRateLimiter = async (req, res, next) => {
  const ratelimit = createRatelimiter(5, '10s'); 
  const identifier = req.user;

  const { success, limit, remaining, reset } = await ratelimit.limit(identifier);

  if (!success) {
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', reset);
    return res.status(429).json({ message: 'Too many requests, please retry later.' });
  }
  res.setHeader('X-RateLimit-Limit', limit);
  res.setHeader('X-RateLimit-Remaining', remaining);
  res.setHeader('X-RateLimit-Reset', reset);
  next();
};

export const postRateLimiter = async (req, res, next) => {
  const ratelimit = createRatelimiter(3, '30s'); 
  const identifier = req.user;

  const { success, limit, remaining, reset } = await ratelimit.limit(identifier);

  if (!success) {
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', reset);
    return res.status(429).json({ message: 'Too many post creations, please retry later.' });
  }
  res.setHeader('X-RateLimit-Limit', limit);
  res.setHeader('X-RateLimit-Remaining', remaining);
  res.setHeader('X-RateLimit-Reset', reset);
  next();
};

export const commentRateLimiter = async (req, res, next) => {
  const ratelimit = createRatelimiter(5, '10s');
  const identifier = req.user;

  const { success, limit, remaining, reset } = await ratelimit.limit(identifier);

  if (!success) {
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', reset);
    return res.status(429).json({ message: 'Too many comments, please retry later.' });
  }
  res.setHeader('X-RateLimit-Limit', limit);
  res.setHeader('X-RateLimit-Remaining', remaining);
  res.setHeader('X-RateLimit-Reset', reset);
  next();
};


import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getCache, setCache } from '../config/redis.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.jwt) {
    try {
      
      token = req.cookies.jwt;

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check Redis cache first
      const cacheKey = `user:id:${decoded.id}`;
      let user = await getCache(cacheKey);

      if (!user) {
        // Cache miss, fetch from database
        user = await User.findById(decoded.id).select('-password');
        if (user) {
          // Cache the user for 1 hour
          await setCache(cacheKey, user, 3600);
        }
      } else {
        console.log(`Cache hit for user ID: ${decoded.id}`);
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
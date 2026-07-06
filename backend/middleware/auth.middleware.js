import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getFallbackUserById, isFallbackMode } from '../config/fallbackStore.js';

const protect = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user;

    if (isFallbackMode()) {
      user = await getFallbackUserById(decoded.id);
    } else {
      user = await User.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(404).json({ message: 'Unauthorized: User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ message: 'Unauthorized: Invalid token' });
  }
};

export { protect, protect as authenticateToken };
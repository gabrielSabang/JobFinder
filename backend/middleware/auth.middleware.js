import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

export const authenticateToken = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
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
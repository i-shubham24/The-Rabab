import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import env from '../config/env.js';
import User from '../models/User.js';

// Protect routes for ANY logged in user (customer or admin)
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, env.jwtSecret);
      
      // If it's the hardcoded admin
      if (decoded.role === 'admin' && decoded.id === 'admin') {
        req.user = decoded;
      } else {
        // Fetch user from DB
        req.user = await User.findById(decoded.id).select('-password');
      }
      
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Protect routes for ADMIN only
export const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
});

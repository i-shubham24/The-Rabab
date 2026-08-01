import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import env from '../config/env.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, env.jwtSecret);
      
      if (decoded.role === 'admin') {
        req.user = decoded;
        next();
      } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
      }
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

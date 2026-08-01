import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import env from '../config/env.js';

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (email === env.adminEmail && password === env.adminPassword) {
    const token = jwt.sign({ id: 'admin', role: 'admin' }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn,
    });

    res.json({
      success: true,
      token,
      user: {
        email: env.adminEmail,
        role: 'admin',
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

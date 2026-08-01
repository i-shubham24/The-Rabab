import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import env from '../config/env.js';
import User from '../models/User.js';

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

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id, role: 'user' }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      loyaltyPoints: user.loyaltyPoints,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      loyaltyPoints: user.loyaltyPoints,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      loyaltyPoints: user.loyaltyPoints,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

import express from 'express';
import { loginAdmin, registerUser, loginUser, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin
router.post('/login', loginAdmin);

// Customer
router.post('/customer/register', registerUser);
router.post('/customer/login', loginUser);
router.get('/customer/profile', protect, getUserProfile);

export default router;

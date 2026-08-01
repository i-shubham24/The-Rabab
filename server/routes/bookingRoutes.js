import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  getAvailableSlots,
} from '../controllers/bookingController.js';

const router = express.Router();

// Public routes
router.post('/', createBooking);
router.get('/availability/:date', getAvailableSlots);

// Admin routes
router.get('/', protect, admin, getBookings);
router.route('/:id').get(protect, admin, getBookingById).put(protect, admin, updateBookingStatus);

export default router;

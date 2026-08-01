import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
} from '../controllers/bookingController.js';

const router = express.Router();

router.route('/').post(createBooking).get(protect, admin, getBookings);
router.route('/:id').get(protect, admin, getBookingById).put(protect, admin, updateBookingStatus);

export default router;

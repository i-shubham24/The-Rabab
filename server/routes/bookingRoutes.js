import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
} from '../controllers/bookingController.js';

const router = express.Router();

router.route('/').post(createBooking).get(protect, getBookings);
router.route('/:id').get(protect, getBookingById).put(protect, updateBookingStatus);

export default router;

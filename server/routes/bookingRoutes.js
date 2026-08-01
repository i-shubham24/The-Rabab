import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
} from '../controllers/bookingController.js';

const router = express.Router();

router.route('/').post(createBooking).get(getBookings);
router.route('/:id').get(getBookingById).put(updateBookingStatus);

export default router;

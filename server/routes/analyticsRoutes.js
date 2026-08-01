import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getOverview,
  getRevenueChart,
  getBookingsByStatus,
  getPopularDishes,
  getPeakHours,
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/overview', protect, admin, getOverview);
router.get('/revenue', protect, admin, getRevenueChart);
router.get('/bookings-by-status', protect, admin, getBookingsByStatus);
router.get('/popular-dishes', protect, admin, getPopularDishes);
router.get('/peak-hours', protect, admin, getPeakHours);

export default router;

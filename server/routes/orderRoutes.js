import express from 'express';
import {
  createOrder,
  getAdminOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Allow guests to create orders, but we can still extract user from token if they are logged in.
// We'll use a custom middleware or just let the controller handle optional user extraction.
// Since protect throws an error if no token, we need an optional auth middleware if we want guest checkout.
// For MVP, if we want guest checkout to work smoothly without throwing 401, we just won't use protect on POST /
router.route('/')
  .post(createOrder);

router.route('/admin')
  .get(protect, admin, getAdminOrders);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

export default router;

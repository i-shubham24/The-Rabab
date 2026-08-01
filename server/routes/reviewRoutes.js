import express from 'express';
import {
  createReview,
  getApprovedReviews,
  getAllReviews,
  updateReviewStatus
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getApprovedReviews)
  .post(protect, createReview);

router.route('/admin')
  .get(protect, admin, getAllReviews);

router.route('/:id')
  .put(protect, admin, updateReviewStatus);

export default router;

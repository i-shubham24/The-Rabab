import Review from '../models/Review.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { rating, text } = req.body;

  const review = await Review.create({
    user: req.user._id,
    rating: Number(rating),
    text
  });

  res.status(201).json(review);
});

// @desc    Get approved reviews (public)
// @route   GET /api/reviews
// @access  Public
export const getApprovedReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ status: 'Approved' })
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(10);
  res.json(reviews);
});

// @desc    Get all reviews (admin)
// @route   GET /api/reviews/admin
// @access  Private/Admin
export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({})
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json(reviews);
});

// @desc    Update review status
// @route   PUT /api/reviews/:id
// @access  Private/Admin
export const updateReviewStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  review.status = status;
  await review.save();

  res.json(review);
});

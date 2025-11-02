const express = require('express');
const {
  createReview,
  getProductReviews,
  getProductRatingStats,
  getUserReviews,
  markHelpful,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes - không cần authentication
router.get('/product/:productId', getProductReviews);
router.get('/product/:productId/stats', getProductRatingStats);

// Protected routes - cần authentication
router.use(protect);

router.post('/', createReview);
router.get('/my-reviews', getUserReviews);
router.put('/:reviewId/helpful', markHelpful);
router.put('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);

module.exports = router;
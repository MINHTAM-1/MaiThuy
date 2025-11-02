const express = require('express');
const {
  getAllReviews,
  deleteReview,
  getReviewStats
} = require('../../controllers/adminReviewController');
const { protect, admin } = require('../../middleware/auth');

const router = express.Router();

// Tất cả routes cần admin权限
router.use(protect, admin);

router.get('/', getAllReviews);
router.get('/stats', getReviewStats);
router.delete('/:reviewId', deleteReview);

module.exports = router;
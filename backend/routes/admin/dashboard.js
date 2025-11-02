const express = require('express');
const {
  getDashboardStats,
  getRevenueStats,
  getTopProducts,
  getUserStatistics
} = require('../../controllers/adminDashboardController');
const { protect, admin } = require('../../middleware/auth');

const router = express.Router();

// Tất cả routes cần admin权限
router.use(protect, admin);

router.get('/stats', getDashboardStats);
router.get('/revenue', getRevenueStats);
router.get('/top-products', getTopProducts);
router.get('/user-stats', getUserStatistics);

module.exports = router;
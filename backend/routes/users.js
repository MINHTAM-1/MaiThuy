const express = require('express');
const {
  getProfile,
  updateProfile,
  changePassword,
  getUserStats,
  getOrderHistory
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Tất cả routes cần authentication
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.get('/stats', getUserStats);
router.get('/orders', getOrderHistory);

module.exports = router;
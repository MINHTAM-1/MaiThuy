const express = require('express');
const {
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  getOrderStats
} = require('../../controllers/adminOrderController');
const { protect, admin } = require('../../middleware/auth');

const router = express.Router();

// Tất cả routes cần admin权限
router.use(protect, admin);

router.get('/', getAllOrders);
router.get('/stats', getOrderStats);
router.put('/:orderId/status', updateOrderStatus);
router.put('/:orderId/payment-status', updatePaymentStatus);

module.exports = router;
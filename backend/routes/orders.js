const express = require('express');
const {
  createOrder,
  getUserOrders,
  getOrderDetail,
  cancelOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Tất cả routes cần authentication
router.use(protect);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:orderId', getOrderDetail);
router.put('/:orderId/cancel', cancelOrder);

module.exports = router;
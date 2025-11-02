const Order = require('../models/Order');
const { db, ObjectId } = require('../models/database'); 

// Lấy tất cả đơn hàng (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;

    const result = await Order.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      status: status
    });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách đơn hàng: ' + error.message
    });
  }
};

// Cập nhật trạng thái đơn hàng (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    await Order.updateStatus(orderId, status);

    res.json({
      success: true,
      message: `Đã cập nhật trạng thái đơn hàng thành: ${status}`
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật trạng thái đơn hàng: ' + error.message
    });
  }
};

// Cập nhật trạng thái thanh toán (Admin)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    await Order.updatePaymentStatus(orderId, paymentStatus);

    res.json({
      success: true,
      message: `Đã cập nhật trạng thái thanh toán thành: ${paymentStatus}`
    });

  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật trạng thái thanh toán: ' + error.message
    });
  }
};

// Thống kê đơn hàng (Admin)
exports.getOrderStats = async (req, res) => {
  try {
    const database = await db(); 
    const orders = database.collection('orders');

    const stats = await orders.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { 
            $sum: { 
              $cond: [{ $eq: ['$status', 'completed'] }, '$totalAmount', 0] 
            } 
          }
        }
      }
    ]).toArray();

    const totalOrders = await orders.countDocuments();
    const totalRevenue = await orders.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]).toArray();

    res.json({
      success: true,
      data: {
        stats: stats,
        totalOrders: totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê đơn hàng: ' + error.message
    });
  }
};
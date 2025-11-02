const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, note } = req.body;

    // Lấy giỏ hàng hiện tại
    const cart = await Cart.findByUserId(req.user._id);
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Giỏ hàng trống'
      });
    }

    // Lấy thông tin chi tiết sản phẩm và tính tổng
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm ${item.productId} không tồn tại`
        });
      }

      // Kiểm tra số lượng tồn kho
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm ${product.name} chỉ còn ${product.stock} sản phẩm`
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: item.productId,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
        images: product.images
      });
    }

    // Tạo đơn hàng
    const orderData = {
      userId: req.user._id,
      items: orderItems,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod || 'cod',
      shippingAddress: shippingAddress,
      note: note || ''
    };

    const order = await Order.create(orderData);

    // Cập nhật số lượng tồn kho
    for (const item of cart.items) {
      await Product.updateStock(item.productId, -item.quantity);
    }

    // Xóa giỏ hàng sau khi đặt hàng thành công
    await Cart.clearCart(req.user._id);

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công!',
      data: order
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo đơn hàng: ' + error.message
    });
  }
};

// Lấy đơn hàng của user
exports.getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await Order.findByUserId(req.user._id, {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy đơn hàng: ' + error.message
    });
  }
};

// Lấy chi tiết đơn hàng
exports.getOrderDetail = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    // Kiểm tra user có quyền xem đơn hàng này không
    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập đơn hàng này'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy chi tiết đơn hàng: ' + error.message
    });
  }
};

// Hủy đơn hàng
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    // Kiểm tra user có quyền hủy đơn hàng này không
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền hủy đơn hàng này'
      });
    }

    // Chỉ cho phép hủy đơn hàng ở trạng thái pending
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Chỉ có thể hủy đơn hàng ở trạng thái chờ xác nhận'
      });
    }

    await Order.updateStatus(orderId, 'cancelled');

    // Hoàn trả số lượng tồn kho
    for (const item of order.items) {
      await Product.updateStock(item.productId, item.quantity);
    }

    res.json({
      success: true,
      message: 'Đã hủy đơn hàng thành công'
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi hủy đơn hàng: ' + error.message
    });
  }
};
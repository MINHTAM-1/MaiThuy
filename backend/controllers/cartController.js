const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Lấy giỏ hàng của user
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findByUserId(req.user._id);
    
    if (!cart) {
      return res.json({
        success: true,
        data: {
          items: [],
          totalItems: 0,
          totalAmount: 0
        }
      });
    }

    // Lấy thông tin chi tiết sản phẩm
    const itemsWithDetails = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          addedAt: item.addedAt,
          product: product
        };
      })
    );

    // Tính tổng
    const totalAmount = itemsWithDetails.reduce((total, item) => {
      return total + (item.product ? item.product.price * item.quantity : 0);
    }, 0);

    res.json({
      success: true,
      data: {
        items: itemsWithDetails,
        totalItems: itemsWithDetails.length,
        totalAmount: totalAmount
      }
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy giỏ hàng: ' + error.message
    });
  }
};

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu productId'
      });
    }

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không tồn tại'
      });
    }

    // Kiểm tra số lượng tồn kho
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng trong kho không đủ'
      });
    }

    const cart = await Cart.addItem(req.user._id, productId, parseInt(quantity));

    res.json({
      success: true,
      message: 'Đã thêm vào giỏ hàng',
      data: cart
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm vào giỏ hàng: ' + error.message
    });
  }
};

// Cập nhật số lượng sản phẩm
exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng không hợp lệ'
      });
    }

    // Kiểm tra sản phẩm tồn tại và số lượng tồn kho
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không tồn tại'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng trong kho không đủ'
      });
    }

    await Cart.updateItemQuantity(req.user._id, productId, parseInt(quantity));

    res.json({
      success: true,
      message: 'Đã cập nhật giỏ hàng'
    });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật giỏ hàng: ' + error.message
    });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    await Cart.removeItem(req.user._id, productId);

    res.json({
      success: true,
      message: 'Đã xóa sản phẩm khỏi giỏ hàng'
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa khỏi giỏ hàng: ' + error.message
    });
  }
};

// Xóa toàn bộ giỏ hàng
exports.clearCart = async (req, res) => {
  try {
    await Cart.clearCart(req.user._id);

    res.json({
      success: true,
      message: 'Đã xóa toàn bộ giỏ hàng'
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa giỏ hàng: ' + error.message
    });
  }
};
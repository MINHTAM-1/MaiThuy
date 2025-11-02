const User = require('../models/User');
const Order = require('../models/Order');
const Review = require('../models/Review');
const bcrypt = require('bcryptjs');
const { db, ObjectId } = require('../models/database'); 

// Lấy thông tin user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin profile: ' + error.message
    });
  }
};

// Cập nhật thông tin user
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    await User.updateProfile(req.user._id, updateData);
    
    // Lấy thông tin user đã cập nhật
    const updatedUser = await User.findById(req.user._id);

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công!',
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
        avatar: updatedUser.avatar
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật profile: ' + error.message
    });
  }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      });
    }

    // Lấy user với password 
    const database = await db(); // Sửa từ require('../models/database').connectDB() thành db()
    const users = database.collection('users');
    const user = await users.findOne({ 
      _id: new ObjectId(req.user._id) // Sửa từ require('../models/database').ObjectId thành ObjectId
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    // Kiểm tra mật khẩu hiện tại
    const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }

    // Hash mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Cập nhật mật khẩu
    await users.updateOne(
      { _id: new ObjectId(req.user._id) }, 
      { 
        $set: { 
          password: hashedNewPassword,
          updatedAt: new Date()
        } 
      }
    );

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công!'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đổi mật khẩu: ' + error.message
    });
  }
};

// Lấy thống kê của user
exports.getUserStats = async (req, res) => {
  try {
    const database = await db(); 
    const orders = database.collection('orders');
    const reviews = database.collection('reviews');

    const userId = new ObjectId(req.user._id); 

    const [orderStats, reviewStats, totalSpent] = await Promise.all([
      // Thống kê orders
      orders.aggregate([
        { $match: { userId: userId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]).toArray(),

      // Thống kê reviews
      reviews.countDocuments({ userId: userId }),

      // Tổng tiền đã chi
      orders.aggregate([
        { 
          $match: { 
            userId: userId,
            status: 'completed'
          } 
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ]).toArray()
    ]);

    const stats = {
      totalOrders: orderStats.reduce((sum, stat) => sum + stat.count, 0),
      orderStatus: orderStats,
      totalReviews: reviewStats,
      totalSpent: totalSpent[0]?.total || 0
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê user: ' + error.message
    });
  }
};

// Lấy lịch sử orders của user với chi tiết
exports.getOrderHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;

    const database = await db();
    const orders = database.collection('orders');

    const userId = new ObjectId(req.user._id);
    const skip = (page - 1) * limit;

    // Build query
    let query = { userId: userId };
    if (status) query.status = status;

    const [data, total] = await Promise.all([
      orders.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray(),
      orders.countDocuments(query)
    ]);

    // Lấy thông tin sản phẩm cho mỗi order
    const ordersWithProducts = await Promise.all(
      data.map(async (order) => {
        const productDetails = await Promise.all(
          order.items.map(async (item) => {
            const product = await require('../models/Product').findById(item.productId);
            return {
              ...item,
              productDetails: product
            };
          })
        );

        return {
          ...order,
          items: productDetails
        };
      })
    );

    res.json({
      success: true,
      data: ordersWithProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get order history error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy lịch sử đơn hàng: ' + error.message
    });
  }
};
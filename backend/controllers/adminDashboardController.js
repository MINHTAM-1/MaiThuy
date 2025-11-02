const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');
const { db, ObjectId } = require('../models/database'); // Import đúng cách

// Lấy thống kê tổng quan dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const database = await db(); // Sửa từ require('../models/database').connectDB() thành db()
    
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      lowStockProducts,
      orderStats,
      revenueStats
    ] = await Promise.all([
      // Tổng users
      database.collection('users').countDocuments({ role: 'user' }),
      
      // Tổng products
      database.collection('products').countDocuments({ active: true }),
      
      // Tổng orders
      database.collection('orders').countDocuments(),
      
      // Tổng doanh thu (chỉ tính orders completed)
      database.collection('orders').aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]).toArray(),
      
      // Orders gần đây (7 ngày)
      database.collection('orders').find()
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
      
      // Sản phẩm sắp hết hàng
      database.collection('products').find({ 
        stock: { $lte: 10 },
        active: true 
      })
      .sort({ stock: 1 })
      .limit(5)
      .toArray(),
      
      // Thống kê orders theo status
      database.collection('orders').aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            revenue: { 
              $sum: { 
                $cond: [{ $eq: ['$status', 'completed'] }, '$totalAmount', 0] 
              } 
            }
          }
        }
      ]).toArray(),
      
      // Doanh thu 7 ngày gần đây
      database.collection('orders').aggregate([
        {
          $match: {
            status: 'completed',
            createdAt: {
              $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            revenue: { $sum: '$totalAmount' },
            orders: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]).toArray()
    ]);

    const stats = {
      overview: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      orders: {
        recent: recentOrders,
        status: orderStats
      },
      products: {
        lowStock: lowStockProducts
      },
      revenue: {
        weekly: revenueStats
      }
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê dashboard: ' + error.message
    });
  }
};

// Lấy doanh thu theo tháng
exports.getRevenueStats = async (req, res) => {
  try {
    const { months = 6 } = req.query;
    
    const database = await db(); // Sửa từ require('../models/database').connectDB() thành db()
    const orders = database.collection('orders');

    const revenueStats = await orders.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: {
            $gte: new Date(Date.now() - parseInt(months) * 30 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
          averageOrder: { $avg: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]).toArray();

    // Format kết quả
    const formattedStats = revenueStats.map(stat => ({
      period: `${stat._id.month}/${stat._id.year}`,
      revenue: stat.revenue,
      orders: stat.orders,
      averageOrder: Math.round(stat.averageOrder)
    }));

    res.json({
      success: true,
      data: formattedStats
    });

  } catch (error) {
    console.error('Get revenue stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê doanh thu: ' + error.message
    });
  }
};

// Lấy top sản phẩm bán chạy
exports.getTopProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const database = await db(); // Sửa từ require('../models/database').connectDB() thành db()
    const orders = database.collection('orders');

    const topProducts = await orders.aggregate([
      { $match: { status: { $in: ['completed', 'ready'] } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          productName: { $first: '$items.productName' },
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: parseInt(limit) }
    ]).toArray();

    // Lấy thông tin chi tiết sản phẩm
    const productsWithDetails = await Promise.all(
      topProducts.map(async (product) => {
        const productDetails = await Product.findById(product._id);
        return {
          ...product,
          productDetails: productDetails
        };
      })
    );

    res.json({
      success: true,
      data: productsWithDetails
    });

  } catch (error) {
    console.error('Get top products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy top sản phẩm: ' + error.message
    });
  }
};

// Lấy user statistics
exports.getUserStatistics = async (req, res) => {
  try {
    const database = await db(); // Sửa từ require('../models/database').connectDB() thành db()
    const users = database.collection('users');
    const orders = database.collection('orders');

    const [userStats, topCustomers] = await Promise.all([
      // Thống kê users
      users.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]).toArray(),

      // Top customers
      orders.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: '$userId',
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: '$totalAmount' }
          }
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 10 }
      ]).toArray()
    ]);

    // Lấy thông tin user cho top customers
    const topCustomersWithDetails = await Promise.all(
      topCustomers.map(async (customer) => {
        const user = await User.findById(customer._id);
        return {
          ...customer,
          userDetails: user ? {
            name: user.name,
            email: user.email,
            phone: user.phone
          } : null
        };
      })
    );

    res.json({
      success: true,
      data: {
        userStats,
        topCustomers: topCustomersWithDetails
      }
    });

  } catch (error) {
    console.error('Get user statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê users: ' + error.message
    });
  }
};
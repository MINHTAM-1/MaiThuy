const Review = require('../models/Review');
const { db, ObjectId } = require('../models/database'); 

// Lấy tất cả reviews (Admin)
exports.getAllReviews = async (req, res) => {
  try {
    const database = await db(); 
    const reviews = database.collection('reviews');

    const { page = 1, limit = 10, rating = '', verified = '' } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    if (rating) query.rating = parseInt(rating);
    if (verified === 'true') query.verifiedPurchase = true;
    if (verified === 'false') query.verifiedPurchase = false;

    const [data, total] = await Promise.all([
      reviews.aggregate([
        { $match: query },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) },
        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: '_id',
            as: 'product'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $addFields: {
            product: { $arrayElemAt: ['$product', 0] },
            user: { $arrayElemAt: ['$user', 0] }
          }
        },
        {
          $project: {
            'user.password': 0,
            'user.role': 0
          }
        }
      ]).toArray(),
      reviews.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách reviews: ' + error.message
    });
  }
};

// Xóa review (Admin)
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    await Review.delete(reviewId);

    res.json({
      success: true,
      message: 'Đã xóa review thành công'
    });

  } catch (error) {
    console.error('Admin delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa review: ' + error.message
    });
  }
};

// Thống kê reviews (Admin)
exports.getReviewStats = async (req, res) => {
  try {
    const database = await db(); // Sửa từ require('../models/database').connectDB() thành db()
    const reviews = database.collection('reviews');

    const stats = await reviews.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    const totalReviews = await reviews.countDocuments();
    const verifiedReviews = await reviews.countDocuments({ verifiedPurchase: true });
    const averageRating = await reviews.aggregate([
      {
        $group: {
          _id: null,
          average: { $avg: '$rating' }
        }
      }
    ]).toArray();

    // Reviews theo tháng
    const monthlyStats = await reviews.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 }
    ]).toArray();

    res.json({
      success: true,
      data: {
        totalReviews,
        verifiedReviews,
        averageRating: averageRating[0]?.average || 0,
        ratingDistribution: stats,
        monthlyStats
      }
    });

  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê reviews: ' + error.message
    });
  }
};
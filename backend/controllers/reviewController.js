const Review = require('../models/Review');
const Product = require('../models/Product');
const { db, ObjectId } = require('../models/database'); // Import đúng cách

// Tạo đánh giá mới
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    // Validation
    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin: productId, rating, comment'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating phải từ 1 đến 5 sao'
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

    // Kiểm tra user đã mua sản phẩm chưa
    const verifiedPurchase = await Review.checkUserPurchase(req.user._id, productId);

    const reviewData = {
      userId: req.user._id,
      productId: productId,
      userName: req.user.name,
      userAvatar: req.user.avatar || req.user.name.charAt(0),
      rating: parseInt(rating),
      title: title || '',
      comment: comment,
      verifiedPurchase: verifiedPurchase
    };

    const review = await Review.create(reviewData);

    res.status(201).json({
      success: true,
      message: 'Đã thêm đánh giá thành công!',
      data: review
    });

  } catch (error) {
    console.error('Create review error:', error);
    
    if (error.message.includes('đã đánh giá')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo đánh giá: ' + error.message
    });
  }
};

// Lấy đánh giá theo sản phẩm
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = 'newest' } = req.query;

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không tồn tại'
      });
    }

    const result = await Review.findByProductId(productId, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort
    });

    // Lấy thống kê rating
    const ratingStats = await Review.getRatingStats(productId);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      ratingStats: ratingStats
    });

  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy đánh giá: ' + error.message
    });
  }
};

// Lấy thống kê rating của sản phẩm
exports.getProductRatingStats = async (req, res) => {
  try {
    const { productId } = req.params;

    const ratingStats = await Review.getRatingStats(productId);

    res.json({
      success: true,
      data: ratingStats
    });

  } catch (error) {
    console.error('Get rating stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê rating: ' + error.message
    });
  }
};

// Lấy đánh giá của user
exports.getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await Review.findByUserId(req.user._id, {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy đánh giá của user: ' + error.message
    });
  }
};

// Đánh dấu review là hữu ích
exports.markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.markHelpful(reviewId, req.user._id);

    res.json({
      success: true,
      message: 'Đã đánh dấu review là hữu ích'
    });

  } catch (error) {
    console.error('Mark helpful error:', error);
    
    if (error.message.includes('đã đánh dấu')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi khi đánh dấu hữu ích: ' + error.message
    });
  }
};

// Cập nhật đánh giá
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;

    // Tìm review - SỬA Ở ĐÂY
    const database = await db(); // Sửa từ require('../models/database').connectDB() thành db()
    const reviews = database.collection('reviews');
    
    const review = await reviews.findOne({ 
      _id: new ObjectId(reviewId) // Sửa từ require('../models/database').ObjectId thành ObjectId
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá'
      });
    }

    // Kiểm tra user có quyền chỉnh sửa
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền chỉnh sửa đánh giá này'
      });
    }

    const updateData = {};
    if (rating) updateData.rating = parseInt(rating);
    if (title !== undefined) updateData.title = title;
    if (comment) updateData.comment = comment;

    await Review.update(reviewId, updateData);

    res.json({
      success: true,
      message: 'Đã cập nhật đánh giá thành công'
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật đánh giá: ' + error.message
    });
  }
};

// Xóa đánh giá
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Tìm review - SỬA Ở ĐÂY
    const database = await db(); // Sửa từ require('../models/database').connectDB() thành db()
    const reviews = database.collection('reviews');
    
    const review = await reviews.findOne({ 
      _id: new ObjectId(reviewId) // Sửa từ require('../models/database').ObjectId thành ObjectId
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá'
      });
    }

    // Kiểm tra user có quyền xóa (user hoặc admin)
    if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa đánh giá này'
      });
    }

    await Review.delete(reviewId);

    res.json({
      success: true,
      message: 'Đã xóa đánh giá thành công'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa đánh giá: ' + error.message
    });
  }
};
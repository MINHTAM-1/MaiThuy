const { db, ObjectId } = require('./database');

class Review {
  // Tạo đánh giá mới
  static async create(reviewData) {
    const database = await db();
    const reviews = database.collection('reviews');
    
    try {
      // Kiểm tra user đã đánh giá sản phẩm này chưa
      const existingReview = await reviews.findOne({
        userId: new ObjectId(reviewData.userId),
        productId: new ObjectId(reviewData.productId)
      });

      if (existingReview) {
        throw new Error('Bạn đã đánh giá sản phẩm này rồi');
      }

      const review = {
        userId: new ObjectId(reviewData.userId),
        productId: new ObjectId(reviewData.productId),
        userName: reviewData.userName,
        userAvatar: reviewData.userAvatar,
        rating: parseInt(reviewData.rating),
        title: reviewData.title || '',
        comment: reviewData.comment,
        helpful: 0,
        verifiedPurchase: reviewData.verifiedPurchase || false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await reviews.insertOne(review);
      return { ...review, _id: result.insertedId };
    } catch (error) {
      throw new Error('Lỗi khi tạo đánh giá: ' + error.message);
    }
  }

  // Lấy đánh giá theo productId
  static async findByProductId(productId, { page = 1, limit = 10, sort = 'newest' } = {}) {
    const database = await db(); 
    const reviews = database.collection('reviews');
    
    try {
      const objectId = new ObjectId(productId);
      const skip = (page - 1) * limit;

      // Sắp xếp
      let sortOption = { createdAt: -1 }; // Mặc định mới nhất
      if (sort === 'helpful') sortOption = { helpful: -1, createdAt: -1 };
      if (sort === 'highest') sortOption = { rating: -1, createdAt: -1 };
      if (sort === 'lowest') sortOption = { rating: 1, createdAt: -1 };

      const [data, total] = await Promise.all([
        reviews.find({ productId: objectId })
          .sort(sortOption)
          .skip(skip)
          .limit(parseInt(limit))
          .toArray(),
        reviews.countDocuments({ productId: objectId })
      ]);

      return {
        data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error('ID sản phẩm không hợp lệ');
    }
  }

  // Lấy đánh giá theo userId
  static async findByUserId(userId, { page = 1, limit = 10 } = {}) {
    const database = await db(); 
    const reviews = database.collection('reviews');
    
    try {
      const objectId = new ObjectId(userId);
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        reviews.find({ userId: objectId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .toArray(),
        reviews.countDocuments({ userId: objectId })
      ]);

      return {
        data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error('ID user không hợp lệ');
    }
  }

  // Lấy thống kê rating theo productId
  static async getRatingStats(productId) {
    const database = await db(); 
    const reviews = database.collection('reviews');
    
    try {
      const objectId = new ObjectId(productId);

      const stats = await reviews.aggregate([
        { $match: { productId: objectId } },
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 }
          }
        }
      ]).toArray();

      // Tính tổng số đánh giá và điểm trung bình
      const totalReviews = await reviews.countDocuments({ productId: objectId });
      const averageResult = await reviews.aggregate([
        { $match: { productId: objectId } },
        {
          $group: {
            _id: null,
            average: { $avg: '$rating' },
            total: { $sum: 1 }
          }
        }
      ]).toArray();

      const averageRating = averageResult[0]?.average || 0;
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      stats.forEach(stat => {
        ratingDistribution[stat._id] = stat.count;
      });

      return {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        ratingDistribution
      };
    } catch (error) {
      throw new Error('ID sản phẩm không hợp lệ');
    }
  }

  // Đánh dấu review là hữu ích
  static async markHelpful(reviewId, userId) {
    const database = await db(); 
    const reviews = database.collection('reviews');
    const helpfulLogs = database.collection('helpful_logs');
    
    try {
      const reviewObjectId = new ObjectId(reviewId);
      const userObjectId = new ObjectId(userId);

      // Kiểm tra user đã đánh dấu hữu ích chưa
      const existingLog = await helpfulLogs.findOne({
        reviewId: reviewObjectId,
        userId: userObjectId
      });

      if (existingLog) {
        throw new Error('Bạn đã đánh dấu review này là hữu ích rồi');
      }

      // Tăng số helpful
      const result = await reviews.updateOne(
        { _id: reviewObjectId },
        { $inc: { helpful: 1 } }
      );

      // Ghi log
      await helpfulLogs.insertOne({
        reviewId: reviewObjectId,
        userId: userObjectId,
        createdAt: new Date()
      });

      return result;
    } catch (error) {
      throw new Error('Lỗi khi đánh dấu hữu ích: ' + error.message);
    }
  }

  // Cập nhật đánh giá
  static async update(reviewId, updateData) {
    const database = await db(); 
    const reviews = database.collection('reviews');
    
    try {
      const objectId = new ObjectId(reviewId);

      const result = await reviews.updateOne(
        { _id: objectId },
        { 
          $set: {
            ...updateData,
            updatedAt: new Date()
          }
        }
      );

      return result;
    } catch (error) {
      throw new Error('ID review không hợp lệ');
    }
  }

  // Xóa đánh giá
  static async delete(reviewId) {
    const database = await db(); 
    const reviews = database.collection('reviews');
    
    try {
      const objectId = new ObjectId(reviewId);
      return await reviews.deleteOne({ _id: objectId });
    } catch (error) {
      throw new Error('ID review không hợp lệ');
    }
  }

  // Kiểm tra user đã mua sản phẩm chưa (để xác minh mua hàng)
  static async checkUserPurchase(userId, productId) {
    const database = await db(); 
    const orders = database.collection('orders');
    
    try {
      const userObjectId = new ObjectId(userId);
      const productObjectId = new ObjectId(productId);

      const purchase = await orders.findOne({
        userId: userObjectId,
        'items.productId': productObjectId,
        status: { $in: ['completed', 'ready'] }
      });

      return !!purchase;
    } catch (error) {
      return false;
    }
  }
}

module.exports = Review;
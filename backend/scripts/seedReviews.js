const { connectDB, ObjectId } = require('../models/database');

async function seedReviews() {
  try {
    const database = await connectDB();
    const reviews = database.collection('reviews');
    const products = database.collection('products');
    const users = database.collection('users');

    console.log('🗑️ Đang xóa dữ liệu reviews cũ...');
    await reviews.deleteMany({});

    // Lấy danh sách products và users
    const productList = await products.find({}).toArray();
    const userList = await users.find({}).toArray();

    if (productList.length === 0 || userList.length === 0) {
      console.log('❌ Cần có products và users trước khi seed reviews');
      process.exit(1);
    }

    const sampleReviews = [];

    // Tạo reviews cho mỗi sản phẩm
    productList.forEach(product => {
      // Mỗi sản phẩm có 3-5 reviews
      const reviewCount = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < reviewCount; i++) {
        const user = userList[Math.floor(Math.random() * userList.length)];
        const rating = Math.floor(Math.random() * 2) + 4; // 4-5 sao
        const helpful = Math.floor(Math.random() * 10);
        
        const reviewsTemplates = [
          {
            titles: [
              "Sản phẩm tuyệt vời!",
              "Rất hài lòng",
              "Chất lượng tốt",
              "Đáng đồng tiền",
              "Sẽ mua lại"
            ],
            comments: [
              "Sản phẩm chất lượng, hương vị thơm ngon. Tôi rất hài lòng! Đặt biệt là cái bạn nhân viên Huy",
              "Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ dài lâu.",
              "Hương vị đặc trưng, giá cả hợp lý. Rất đáng để thử!",
              "Sản phẩm đúng như mô tả, chất lượng vượt mong đợi.",
              "Dịch vụ tốt, nhân viên thân thiện. Cảm ơn cửa hàng!"
            ]
          }
        ];

        const template = reviewsTemplates[0];
        const title = template.titles[Math.floor(Math.random() * template.titles.length)];
        const comment = template.comments[Math.floor(Math.random() * template.comments.length)];

        sampleReviews.push({
          userId: user._id,
          productId: product._id,
          userName: user.name,
          userAvatar: user.name.charAt(0),
          rating: rating,
          title: title,
          comment: comment,
          helpful: helpful,
          verifiedPurchase: Math.random() > 0.3, // 70% verified
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
          updatedAt: new Date()
        });
      }
    });

    console.log('📝 Đang thêm dữ liệu reviews mẫu...');
    const result = await reviews.insertMany(sampleReviews);
    console.log(`✅ Đã thêm ${result.insertedCount} reviews mẫu`);

    // Cập nhật rating cho các sản phẩm
    console.log('🔄 Đang cập nhật rating cho sản phẩm...');
    for (const product of productList) {
      const ratingStats = await reviews.aggregate([
        { $match: { productId: product._id } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            reviewCount: { $sum: 1 }
          }
        }
      ]).toArray();

      const stats = ratingStats[0] || { averageRating: 0, reviewCount: 0 };
      const averageRating = Math.round(stats.averageRating * 10) / 10 || 0;

      await products.updateOne(
        { _id: product._id },
        { 
          $set: { 
            averageRating: averageRating,
            reviewCount: stats.reviewCount
          } 
        }
      );
    }

    console.log('\n📊 THỐNG KÊ REVIEWS:');
    const totalReviews = await reviews.countDocuments();
    const averageRating = await reviews.aggregate([
      { $group: { _id: null, average: { $avg: '$rating' } } }
    ]).toArray();

    console.log(`📈 Tổng số reviews: ${totalReviews}`);
    console.log(`⭐ Rating trung bình: ${(averageRating[0]?.average || 0).toFixed(1)}`);

    console.log('\n🎉 Seed reviews thành công!');
    
  } catch (error) {
    console.error('❌ Lỗi khi thêm dữ liệu reviews:', error);
  } finally {
    process.exit(0);
  }
}

seedReviews();
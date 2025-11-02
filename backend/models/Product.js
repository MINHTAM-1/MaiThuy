const { db, ObjectId } = require("./database");

class Product {
  // Lấy tất cả sản phẩm (có phân trang và filter)
  static async findAll({
    page = 1,
    limit = 10,
    category = "",
    featured = false,
  } = {}) {
    const database = await db();
    const products = database.collection("products");

    // Build query
    let query = { active: true };
    if (category) query.category = category;
    if (featured) query.featured = true;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      products
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray(),
      products.countDocuments(query),
    ]);

    return {
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Lấy sản phẩm theo ID
  static async findById(id) {
    const database = await db();
    const products = database.collection("products");

    try {
      const objectId = new ObjectId(id);
      return await products.findOne({ _id: objectId, active: true });
    } catch (error) {
      throw new Error("ID sản phẩm không hợp lệ");
    }
  }

  // Tìm kiếm sản phẩm
  static async searchProducts(query, { page = 1, limit = 10 } = {}) {
    const database = await db();
    const products = database.collection("products");

    const searchQuery = {
      active: true,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
    };

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      products
        .find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray(),
      products.countDocuments(searchQuery),
    ]);

    return {
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Lấy sản phẩm theo danh mục
  static async findByCategory(category, { page = 1, limit = 10 } = {}) {
    const database = await db();
    const products = database.collection("products");

    const query = {
      category: category,
      active: true,
    };

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      products
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray(),
      products.countDocuments(query),
    ]);

    return {
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Lấy sản phẩm nổi bật
  static async getFeaturedProducts(limit = 8) {
    const database = await db();
    const products = database.collection("products");

    return await products
      .find({
        featured: true,
        active: true,
      })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .toArray();
  }

  // Tạo sản phẩm mới
  static async create(productData) {
    const database = await db();
    const products = database.collection("products");

    const product = {
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      originalPrice: productData.originalPrice
        ? parseFloat(productData.originalPrice)
        : null,
      images: productData.images || [],
      category: productData.category,
      stock: parseInt(productData.stock) || 0,
      tags: productData.tags || [],
      featured: productData.featured || false,
      active: true,
      nutrition: productData.nutrition || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await products.insertOne(product);
    return { ...product, _id: result.insertedId };
  }

  // Cập nhật sản phẩm
  static async update(id, updateData) {
    const database = await db();
    const products = database.collection("products");

    try {
      const objectId = new ObjectId(id);

      const result = await products.updateOne(
        { _id: objectId },
        {
          $set: {
            ...updateData,
            updatedAt: new Date(),
          },
        }
      );

      return result;
    } catch (error) {
      throw new Error("ID sản phẩm không hợp lệ");
    }
  }

  // Xóa mềm sản phẩm (set active = false)
  static async delete(id) {
    const database = await db();
    const products = database.collection("products");

    try {
      const objectId = new ObjectId(id);
      return await products.updateOne(
        { _id: objectId },
        {
          $set: {
            active: false,
            updatedAt: new Date(),
          },
        }
      );
    } catch (error) {
      throw new Error("ID sản phẩm không hợp lệ");
    }
  }

  // Cập nhật số lượng tồn kho
  static async updateStock(id, newStock) {
    const database = await db();
    const products = database.collection("products");

    try {
      const objectId = new ObjectId(id);
      return await products.updateOne(
        { _id: objectId },
        {
          $set: {
            stock: parseInt(newStock),
            updatedAt: new Date(),
          },
        }
      );
    } catch (error) {
      throw new Error("ID sản phẩm không hợp lệ");
    }
  }

  // Lấy danh sách categories
  static async getCategories() {
    const database = await db();
    const products = database.collection("products");

    return await products.distinct("category", { active: true });
  }

  static async updateProductRating(productId) {
    const database = await db();
    const reviews = database.collection("reviews");
    const products = database.collection("products");

    try {
      const objectId = new ObjectId(productId);

      const ratingStats = await reviews
        .aggregate([
          { $match: { productId: objectId } },
          {
            $group: {
              _id: null,
              averageRating: { $avg: "$rating" },
              reviewCount: { $sum: 1 },
            },
          },
        ])
        .toArray();

      const stats = ratingStats[0] || { averageRating: 0, reviewCount: 0 };
      const averageRating = Math.round(stats.averageRating * 10) / 10 || 0;

      await products.updateOne(
        { _id: objectId },
        {
          $set: {
            averageRating: averageRating,
            reviewCount: stats.reviewCount,
            updatedAt: new Date(),
          },
        }
      );

      return { averageRating, reviewCount: stats.reviewCount };
    } catch (error) {
      throw new Error("Lỗi khi cập nhật rating: " + error.message);
    }
  }
}

module.exports = Product;

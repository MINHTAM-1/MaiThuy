const { db, ObjectId } = require('./database'); // Sửa thành db

class Order {
  // Tạo đơn hàng mới
  static async create(orderData) {
    const database = await db(); // Sửa thành db()
    const orders = database.collection('orders');
    
    try {
      const order = {
        userId: new ObjectId(orderData.userId),
        items: orderData.items.map(item => ({
          productId: new ObjectId(item.productId),
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
          images: item.images
        })),
        totalAmount: orderData.totalAmount,
        status: 'pending', // pending, confirmed, preparing, ready, completed, cancelled
        paymentMethod: orderData.paymentMethod || 'cod',
        paymentStatus: 'pending', // pending, paid, failed
        shippingAddress: orderData.shippingAddress,
        note: orderData.note || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await orders.insertOne(order);
      return { ...order, _id: result.insertedId };
    } catch (error) {
      throw new Error('Lỗi khi tạo đơn hàng: ' + error.message);
    }
  }

  // Lấy đơn hàng theo user
  static async findByUserId(userId, { page = 1, limit = 10 } = {}) {
    const database = await db(); // Sửa thành db()
    const orders = database.collection('orders');
    
    try {
      const userObjectId = new ObjectId(userId);
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        orders.find({ userId: userObjectId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .toArray(),
        orders.countDocuments({ userId: userObjectId })
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

  // Lấy chi tiết đơn hàng
  static async findById(orderId) {
    const database = await db(); // Sửa thành db()
    const orders = database.collection('orders');
    
    try {
      const objectId = new ObjectId(orderId);
      return await orders.findOne({ _id: objectId });
    } catch (error) {
      throw new Error('ID đơn hàng không hợp lệ');
    }
  }

  // Cập nhật trạng thái đơn hàng
  static async updateStatus(orderId, status) {
    const database = await db(); // Sửa thành db()
    const orders = database.collection('orders');
    
    try {
      const objectId = new ObjectId(orderId);
      const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
      
      if (!validStatuses.includes(status)) {
        throw new Error('Trạng thái không hợp lệ');
      }

      const result = await orders.updateOne(
        { _id: objectId },
        { 
          $set: { 
            status: status,
            updatedAt: new Date()
          } 
        }
      );

      return result;
    } catch (error) {
      throw new Error('Lỗi khi cập nhật đơn hàng: ' + error.message);
    }
  }

  // Cập nhật trạng thái thanh toán
  static async updatePaymentStatus(orderId, paymentStatus) {
    const database = await db(); // Sửa thành db()
    const orders = database.collection('orders');
    
    try {
      const objectId = new ObjectId(orderId);
      const validStatuses = ['pending', 'paid', 'failed'];
      
      if (!validStatuses.includes(paymentStatus)) {
        throw new Error('Trạng thái thanh toán không hợp lệ');
      }

      const result = await orders.updateOne(
        { _id: objectId },
        { 
          $set: { 
            paymentStatus: paymentStatus,
            updatedAt: new Date()
          } 
        }
      );

      return result;
    } catch (error) {
      throw new Error('Lỗi khi cập nhật trạng thái thanh toán: ' + error.message);
    }
  }

  // Lấy tất cả đơn hàng (Admin)
  static async findAll({ page = 1, limit = 10, status = '' } = {}) {
    const database = await db(); // Sửa thành db()
    const orders = database.collection('orders');
    
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      orders.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray(),
      orders.countDocuments(query)
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
  }

  // Thống kê đơn hàng (Admin)
  static async getStats() {
    const database = await db();
    const orders = database.collection('orders');
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const [totalOrders, pendingOrders, todayOrders, revenueStats] = await Promise.all([
        orders.countDocuments({}),
        orders.countDocuments({ status: 'pending' }),
        orders.countDocuments({ 
          createdAt: { $gte: today, $lt: tomorrow } 
        }),
        orders.aggregate([
          { $match: { status: 'completed' } },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$totalAmount' },
              averageOrder: { $avg: '$totalAmount' }
            }
          }
        ]).toArray()
      ]);

      const stats = revenueStats[0] || { totalRevenue: 0, averageOrder: 0 };

      return {
        totalOrders,
        pendingOrders,
        todayOrders,
        totalRevenue: stats.totalRevenue,
        averageOrder: Math.round(stats.averageOrder * 100) / 100
      };
    } catch (error) {
      throw new Error('Lỗi khi lấy thống kê: ' + error.message);
    }
  }

  // Hủy đơn hàng
  static async cancelOrder(orderId, reason = '') {
    const database = await db();
    const orders = database.collection('orders');
    
    try {
      const objectId = new ObjectId(orderId);

      const result = await orders.updateOne(
        { _id: objectId },
        { 
          $set: { 
            status: 'cancelled',
            cancelReason: reason,
            updatedAt: new Date()
          } 
        }
      );

      return result;
    } catch (error) {
      throw new Error('Lỗi khi hủy đơn hàng: ' + error.message);
    }
  }
}

module.exports = Order;
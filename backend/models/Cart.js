const { db, ObjectId } = require('./database'); // Sửa thành db

class Cart {
  // Lấy giỏ hàng của user
  static async findByUserId(userId) {
    const database = await db(); // Sửa thành db()
    const carts = database.collection('carts');
    
    try {
      const objectId = new ObjectId(userId);
      return await carts.findOne({ userId: objectId });
    } catch (error) {
      throw new Error('ID user không hợp lệ');
    }
  }

  // Thêm sản phẩm vào giỏ hàng
  static async addItem(userId, productId, quantity = 1) {
    const database = await db(); // Sửa thành db()
    const carts = database.collection('carts');
    
    try {
      const userObjectId = new ObjectId(userId);
      const productObjectId = new ObjectId(productId);

      // Kiểm tra giỏ hàng tồn tại
      let cart = await carts.findOne({ userId: userObjectId });

      if (cart) {
        // Cập nhật giỏ hàng tồn tại
        const existingItemIndex = cart.items.findIndex(
          item => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
          // Cập nhật số lượng
          cart.items[existingItemIndex].quantity += quantity;
        } else {
          // Thêm sản phẩm mới
          cart.items.push({
            productId: productObjectId,
            quantity: quantity,
            addedAt: new Date()
          });
        }

        cart.updatedAt = new Date();
        await carts.updateOne(
          { userId: userObjectId },
          { $set: cart }
        );
      } else {
        // Tạo giỏ hàng mới
        cart = {
          userId: userObjectId,
          items: [{
            productId: productObjectId,
            quantity: quantity,
            addedAt: new Date()
          }],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await carts.insertOne(cart);
      }

      return await carts.findOne({ userId: userObjectId });
    } catch (error) {
      throw new Error('Lỗi khi thêm vào giỏ hàng: ' + error.message);
    }
  }

  // Cập nhật số lượng sản phẩm
  static async updateItemQuantity(userId, productId, quantity) {
    const database = await db(); // Sửa thành db()
    const carts = database.collection('carts');
    
    try {
      const userObjectId = new ObjectId(userId);
      const productObjectId = new ObjectId(productId);

      if (quantity <= 0) {
        // Xóa sản phẩm nếu số lượng <= 0
        return await this.removeItem(userId, productId);
      }

      const result = await carts.updateOne(
        { 
          userId: userObjectId,
          'items.productId': productObjectId
        },
        { 
          $set: { 
            'items.$.quantity': quantity,
            'items.$.addedAt': new Date(),
            updatedAt: new Date()
          } 
        }
      );

      return result;
    } catch (error) {
      throw new Error('Lỗi khi cập nhật giỏ hàng: ' + error.message);
    }
  }

  // Xóa sản phẩm khỏi giỏ hàng
  static async removeItem(userId, productId) {
    const database = await db(); // Sửa thành db()
    const carts = database.collection('carts');
    
    try {
      const userObjectId = new ObjectId(userId);
      const productObjectId = new ObjectId(productId);

      const result = await carts.updateOne(
        { userId: userObjectId },
        { 
          $pull: { 
            items: { productId: productObjectId } 
          },
          $set: { updatedAt: new Date() }
        }
      );

      return result;
    } catch (error) {
      throw new Error('Lỗi khi xóa khỏi giỏ hàng: ' + error.message);
    }
  }

  // Xóa toàn bộ giỏ hàng
  static async clearCart(userId) {
    const database = await db(); // Sửa thành db()
    const carts = database.collection('carts');
    
    try {
      const userObjectId = new ObjectId(userId);
      return await carts.deleteOne({ userId: userObjectId });
    } catch (error) {
      throw new Error('Lỗi khi xóa giỏ hàng: ' + error.message);
    }
  }

  // Thêm các phương thức bổ sung
  static async getCartWithProducts(userId) {
    const database = await db();
    const carts = database.collection('carts');
    const products = database.collection('products');
    
    try {
      const userObjectId = new ObjectId(userId);
      const cart = await carts.findOne({ userId: userObjectId });
      
      if (!cart || !cart.items.length) {
        return { items: [], total: 0 };
      }

      // Lấy thông tin chi tiết sản phẩm
      const productIds = cart.items.map(item => item.productId);
      const productDetails = await products.find({
        _id: { $in: productIds },
        active: true
      }).toArray();

      // Kết hợp thông tin
      const itemsWithDetails = cart.items.map(item => {
        const product = productDetails.find(p => p._id.toString() === item.productId.toString());
        return {
          ...item,
          product: product ? {
            name: product.name,
            price: product.price,
            images: product.images,
            stock: product.stock
          } : null
        };
      }).filter(item => item.product !== null); // Lọc sản phẩm không tồn tại

      // Tính tổng tiền
      const total = itemsWithDetails.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
      }, 0);

      return {
        items: itemsWithDetails,
        total: total,
        cartId: cart._id
      };
    } catch (error) {
      throw new Error('Lỗi khi lấy giỏ hàng: ' + error.message);
    }
  }

  // Đếm số sản phẩm trong giỏ hàng
  static async getItemCount(userId) {
    const database = await db();
    const carts = database.collection('carts');
    
    try {
      const userObjectId = new ObjectId(userId);
      const cart = await carts.findOne({ userId: userObjectId });
      
      if (!cart || !cart.items) {
        return 0;
      }

      return cart.items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      throw new Error('Lỗi khi đếm sản phẩm: ' + error.message);
    }
  }
}

module.exports = Cart;
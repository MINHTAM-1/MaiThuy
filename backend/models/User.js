const { db, ObjectId } = require('./database'); // Sửa thành db
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    try {
      const database = await db(); // Sửa thành db()
      const users = database.collection('users');
      
      // Kiểm tra email đã tồn tại chưa
      const existingUser = await users.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('Email đã được sử dụng');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      const user = {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        phone: userData.phone,
        address: userData.address || {},
        role: 'user',
        avatar: userData.avatar || '',
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await users.insertOne(user);
      return { ...user, _id: result.insertedId };
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const database = await db(); // Sửa thành db()
      const users = database.collection('users');
      return await users.findOne({ email });
    } catch (error) {
      throw new Error('Lỗi kết nối database');
    }
  }

  static async findById(id) {
    try {
      const database = await db(); // Sửa thành db()
      const users = database.collection('users');
      
      const objectId = new ObjectId(id);
      return await users.findOne({ _id: objectId });
    } catch (error) {
      throw new Error('ID không hợp lệ');
    }
  }

  static async findByEmailWithPassword(email) {
    try {
      const database = await db(); // Sửa thành db()
      const users = database.collection('users');
      return await users.findOne({ email });
    } catch (error) {
      throw new Error('Lỗi kết nối database');
    }
  }

  static async updateProfile(userId, updateData) {
    try {
      const database = await db(); // Sửa thành db()
      const users = database.collection('users');
      
      const objectId = new ObjectId(userId);
      return await users.updateOne(
        { _id: objectId },
        { 
          $set: {
            ...updateData,
            updatedAt: new Date()
          }
        }
      );
    } catch (error) {
      throw new Error('ID không hợp lệ');
    }
  }

  // Thêm các phương thức mới để hoàn thiện
  static async updatePassword(userId, newPassword) {
    try {
      const database = await db();
      const users = database.collection('users');
      
      const objectId = new ObjectId(userId);
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
      return await users.updateOne(
        { _id: objectId },
        { 
          $set: {
            password: hashedPassword,
            updatedAt: new Date()
          }
        }
      );
    } catch (error) {
      throw new Error('ID không hợp lệ');
    }
  }

  static async verifyEmail(userId) {
    try {
      const database = await db();
      const users = database.collection('users');
      
      const objectId = new ObjectId(userId);
      return await users.updateOne(
        { _id: objectId },
        { 
          $set: {
            isVerified: true,
            updatedAt: new Date()
          }
        }
      );
    } catch (error) {
      throw new Error('ID không hợp lệ');
    }
  }

  static async getAllUsers({ page = 1, limit = 10 } = {}) {
    try {
      const database = await db();
      const users = database.collection('users');
      
      const skip = (page - 1) * limit;
      
      const [data, total] = await Promise.all([
        users.find({})
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .toArray(),
        users.countDocuments({})
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
      throw new Error('Lỗi kết nối database');
    }
  }
}

module.exports = User;
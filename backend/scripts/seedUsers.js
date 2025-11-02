const { connectDB, ObjectId } = require('../models/database');
const bcrypt = require('bcryptjs');

async function seedUsers() {
  try {
    const database = await connectDB();
    const users = database.collection('users');

    console.log('🗑️ Đang xóa dữ liệu users cũ...');
    await users.deleteMany({});

    const sampleUsers = [
      {
        name: "Admin User",
        email: "admin@maithuy.com",
        password: await bcrypt.hash("123456", 12),
        phone: "0912345678",
        address: {
          street: "34 An Bình",
          city: "TP.HCM",
          district: "Quận 5"
        },
        role: "admin",
        avatar: "A",
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Nguyễn Văn A",
        email: "customer1@maithuy.com",
        password: await bcrypt.hash("123456", 12),
        phone: "0912345679",
        address: {
          street: "123 Lý Thường Kiệt",
          city: "TP.HCM", 
          district: "Quận 10"
        },
        role: "user",
        avatar: "N",
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Trần Thị B",
        email: "customer2@maithuy.com", 
        password: await bcrypt.hash("123456", 12),
        phone: "0912345680",
        address: {
          street: "456 Nguyễn Trãi",
          city: "TP.HCM",
          district: "Quận 1"
        },
        role: "user",
        avatar: "T",
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Lê Văn C",
        email: "customer3@maithuy.com",
        password: await bcrypt.hash("123456", 12),
        phone: "0912345681",
        address: {
          street: "789 Cách Mạng Tháng 8",
          city: "TP.HCM",
          district: "Quận 3"
        },
        role: "user",
        avatar: "L",
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    console.log('📝 Đang thêm dữ liệu users mẫu...');
    const result = await users.insertMany(sampleUsers);
    console.log(`✅ Đã thêm ${result.insertedCount} users mẫu`);
    
    console.log('\n👥 DANH SÁCH USERS ĐÃ THÊM:');
    sampleUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} - ${user.email} - ${user.role}`);
    });
    
    console.log('\n🔑 Thông tin đăng nhập test:');
    console.log('Admin: admin@maithuy.com / 123456');
    console.log('Customer: customer1@maithuy.com / 123456');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi thêm dữ liệu users:', error);
    process.exit(1);
  }
}

seedUsers();
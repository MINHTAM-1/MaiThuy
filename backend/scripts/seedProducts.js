const { db, ObjectId } = require('../models/database');

async function seedProducts() {
  let client;
  try {
    // Kết nối database
    const database = await db();
    const products = database.collection('products');

    console.log('🗑️ Đang xóa dữ liệu cũ...');
    await products.deleteMany({});

    const sampleProducts = [
      // COFFEE - 5 món
      {
        name: "Cà Phê Đen Đá",
        description: "Cà phê đen nguyên chất, thơm ngon, đậm đà hương vị Việt Nam",
        price: 25000,
        originalPrice: 30000,
        images: ["/images/products/coffee/ca-phe-den.jpg"],
        category: "coffee",
        stock: 50,
        tags: ["đá", "đậm đà", "truyền thống", "cafe"],
        featured: true,
        active: true,
        nutrition: {
          calories: 5,
          caffeine: 95
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cà Phê Sữa Đá",
        description: "Cà phê pha với sữa đặc, hương vị truyền thống Việt Nam",
        price: 30000,
        originalPrice: 35000,
        images: ["/images/products/coffee/ca-phe-sua.jpg"],
        category: "coffee",
        stock: 45,
        tags: ["sữa", "ngọt", "truyền thống", "cafe"],
        featured: true,
        active: true,
        nutrition: {
          calories: 120,
          caffeine: 95
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Latte",
        description: "Cà phê espresso với sữa nóng và lớp foam mịn",
        price: 45000,
        originalPrice: 50000,
        images: ["/images/products/coffee/latte.jpg"],
        category: "coffee",
        stock: 30,
        tags: ["sữa", "espresso", "nhẹ nhàng", "italia"],
        featured: false,
        active: true,
        nutrition: {
          calories: 180,
          caffeine: 77
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Espresso",
        description: "Cà phê espresso nguyên chất, đậm đà và thơm nồng",
        price: 35000,
        originalPrice: 40000,
        images: ["/images/products/coffee/espresso.jpg"],
        category: "coffee",
        stock: 35,
        tags: ["đậm đà", "espresso", "nguyên chất"],
        featured: false,
        active: true,
        nutrition: {
          calories: 3,
          caffeine: 64
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Bạc Xỉu",
        description: "Cà phê sữa đá kiểu Sài Gòn, thơm béo và ngọt ngào",
        price: 32000,
        originalPrice: 37000,
        images: ["/images/products/coffee/bac-xiu.jpg"],
        category: "coffee",
        stock: 40,
        tags: ["sữa", "ngọt", "sài gòn", "béo"],
        featured: true,
        active: true,
        nutrition: {
          calories: 150,
          caffeine: 60
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // TEA - 3 món
      {
        name: "Trà Sữa Trân Châu",
        description: "Trà sữa thơm ngon với trân châu dai giòn",
        price: 35000,
        originalPrice: 40000,
        images: ["/images/products/tea/tra-sua-tran-chau.jpg"],
        category: "tea",
        stock: 40,
        tags: ["trân châu", "ngọt", "phổ biến", "trà sữa"],
        featured: true,
        active: true,
        nutrition: {
          calories: 250,
          sugar: 35
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Trà Đào Cam Sả",
        description: "Trà đào thơm ngon kết hợp cam sả mát lạnh",
        price: 38000,
        originalPrice: 42000,
        images: ["/images/products/tea/tra-dao-cam-sa.jpg"],
        category: "tea",
        stock: 38,
        tags: ["đào", "cam sả", "mát lạnh", "trà trái cây"],
        featured: false,
        active: true,
        nutrition: {
          calories: 120,
          sugar: 25
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Trà Vải Nhài",
        description: "Trà vải thanh mát với hương nhài nhẹ nhàng",
        price: 36000,
        originalPrice: 40000,
        images: ["/images/products/tea/tra-vai-nhai.jpg"],
        category: "tea",
        stock: 42,
        tags: ["vải", "nhài", "thanh mát", "trà trái cây"],
        featured: false,
        active: true,
        nutrition: {
          calories: 110,
          sugar: 22
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // BAKERY - 3 món
      {
        name: "Bánh Mì Chảo",
        description: "Bánh mì kèm chảo thịt, pate, rau sống đầy đủ",
        price: 40000,
        originalPrice: 45000,
        images: ["/images/products/bakery/banh-mi-chao.jpg"],
        category: "bakery",
        stock: 25,
        tags: ["ăn sáng", "no bụng", "truyền thống", "bánh mì"],
        featured: true,
        active: true,
        nutrition: {
          calories: 450,
          protein: 20
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Croissant",
        description: "Bánh sừng bò giòn tan, thơm bơ, nhiều lớp",
        price: 25000,
        originalPrice: 30000,
        images: ["/images/products/bakery/croissant.jpg"],
        category: "bakery",
        stock: 30,
        tags: ["bơ", "giòn", "pháp", "bánh ngọt"],
        featured: false,
        active: true,
        nutrition: {
          calories: 280,
          fat: 15
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Tiramisu",
        description: "Bánh tiramisu Ý với cà phê, mascarpone thơm ngon",
        price: 45000,
        originalPrice: 50000,
        images: ["/images/products/bakery/tiramisu.jpg"],
        category: "bakery",
        stock: 20,
        tags: ["ý", "cà phê", "mascarpone", "bánh ngọt"],
        featured: true,
        active: true,
        nutrition: {
          calories: 320,
          sugar: 28
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    console.log('📝 Đang thêm dữ liệu mẫu...');
    const result = await products.insertMany(sampleProducts);
    console.log(`✅ Đã thêm ${result.insertedCount} sản phẩm mẫu`);
    
    // Hiển thị thông tin sản phẩm đã thêm
    console.log('\n📦 DANH SÁCH SẢN PHẨM ĐÃ THÊM:');
    sampleProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ${product.price.toLocaleString('vi-VN')}đ - ${product.category}`);
    });
    
    console.log('\n🎉 Seed data thành công!');
    
  } catch (error) {
    console.error('❌ Lỗi khi thêm dữ liệu mẫu:', error);
  } finally {
    // Đóng kết nối
    if (client) {
      await client.close();
    }
    process.exit(0);
  }
}

seedProducts();
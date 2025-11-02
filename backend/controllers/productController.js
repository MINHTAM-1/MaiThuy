const Product = require('../models/Product');

// Lấy tất cả sản phẩm (có phân trang và filter)
exports.getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category = '', 
      featured = '',
      minPrice = '',
      maxPrice = '' 
    } = req.query;

    // Build filter options
    const filterOptions = {
      page: parseInt(page),
      limit: parseInt(limit),
      category: category || '',
      featured: featured === 'true'
    };

    const result = await Product.findAll(filterOptions);

    res.json({
      success: true,
      message: 'Lấy danh sách sản phẩm thành công',
      data: result.data,
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách sản phẩm: ' + error.message
    });
  }
};

// Lấy chi tiết sản phẩm
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    res.json({
      success: true,
      message: 'Lấy thông tin sản phẩm thành công',
      data: product
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin sản phẩm: ' + error.message
    });
  }
};

// Tìm kiếm sản phẩm
exports.searchProducts = async (req, res) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập từ khóa tìm kiếm'
      });
    }

    const result = await Product.searchProducts(q.trim(), {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      message: `Tìm thấy ${result.pagination.total} sản phẩm cho "${q}"`,
      data: result.data,
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tìm kiếm sản phẩm: ' + error.message
    });
  }
};

// Lấy sản phẩm theo danh mục
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const result = await Product.findByCategory(category, {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      message: `Lấy sản phẩm danh mục ${category} thành công`,
      data: result.data,
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy sản phẩm theo danh mục: ' + error.message
    });
  }
};

// Lấy sản phẩm nổi bật
exports.getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.getFeaturedProducts(parseInt(limit));

    res.json({
      success: true,
      message: 'Lấy sản phẩm nổi bật thành công',
      data: products
    });

  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy sản phẩm nổi bật: ' + error.message
    });
  }
};

// Lấy danh sách categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.getCategories();

    res.json({
      success: true,
      message: 'Lấy danh mục thành công',
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh mục: ' + error.message
    });
  }
};

// Tạo sản phẩm mới (Admin)
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      images,
      category,
      stock,
      tags,
      featured,
      nutrition
    } = req.body;

    // Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin: name, description, price, category'
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Giá sản phẩm không hợp lệ'
      });
    }

    const productData = {
      name,
      description,
      price,
      originalPrice,
      images: images || [],
      category,
      stock: stock || 0,
      tags: tags || [],
      featured: featured || false,
      nutrition: nutrition || {}
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: product
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo sản phẩm: ' + error.message
    });
  }
};

// Cập nhật sản phẩm (Admin)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Kiểm tra sản phẩm tồn tại
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    await Product.update(id, updateData);

    // Lấy thông tin sản phẩm đã cập nhật
    const updatedProduct = await Product.findById(id);

    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật sản phẩm: ' + error.message
    });
  }
};

// Xóa sản phẩm (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra sản phẩm tồn tại
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    await Product.delete(id);

    res.json({
      success: true,
      message: 'Xóa sản phẩm thành công'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa sản phẩm: ' + error.message
    });
  }
};
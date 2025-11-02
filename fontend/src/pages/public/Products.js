import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import ProductCard from '../../components/products/ProductCard';
import ReviewSection from '../../components/reviews/ReviewSection';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Lấy category và search term từ URL khi component mount
  useEffect(() => {
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    
    setSelectedCategory(category);
    setSearchTerm(search);
  }, [searchParams]);

  const fetchProducts = async () => {
  try {
    setLoading(true);
    const response = await productsAPI.getAll();
    console.log('📦 Products API response:', response.data);
    
    const productsData = response.data.data || response.data || [];
    console.log('🖼️ Product images:', productsData.map(p => ({
      name: p.name,
      images: p.images,
      firstImage: p.images?.[0]
    })));
    
    setProducts(productsData);
  } catch (error) {
    setError('Lỗi khi tải sản phẩm');
    console.error('Fetch products error:', error);
  } finally {
    setLoading(false);
  }
};

  const fetchCategories = async () => {
    try {
      const response = await productsAPI.getCategories();
      console.log('Categories API response:', response.data); // Debug
      setCategories(response.data.data || response.data || []);
    } catch (error) {
      console.error('Fetch categories error:', error);
    }
  };

  // Filter products based on category and search term
  useEffect(() => {
    let result = products;

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }

    setFilteredProducts(result);
    console.log('Filtered products:', result); // Debug
  }, [products, selectedCategory, searchTerm]);

  const handleCategoryChange = (category) => {
    const newCategory = category === 'all' ? '' : category;
    setSelectedCategory(newCategory);
    
    const newParams = new URLSearchParams(searchParams);
    
    if (!newCategory) {
      newParams.delete('category');
    } else {
      newParams.set('category', newCategory);
    }
    
    // Giữ lại search term khi chuyển category
    if (searchTerm) {
      newParams.set('search', searchTerm);
    }
    
    setSearchParams(newParams);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    const newParams = new URLSearchParams(searchParams);
    
    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }
    
    // Giữ lại category khi tìm kiếm
    if (selectedCategory) {
      newParams.set('category', selectedCategory);
    }
    
    setSearchParams(newParams);
  };

  const clearSearch = () => {
    setSearchTerm('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <section id="product-page" className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sản Phẩm Cà Phê</h1>
          <p className="text-xl text-gray-600">Khám phá các loại cà phê đặc biệt từ MAITHUY</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm theo tên, mô tả..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 pl-10 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <span className="text-gray-400 hover:text-gray-600">✕</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8"> {/* Đã sửa class 'top mb-8' thành 'mb-8' */}
          <ul className="flex flex-wrap gap-4 justify-center">
            <li>
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-6 py-3 rounded-full font-medium transition-colors duration-200 ${
                  !selectedCategory || selectedCategory === 'all'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Tất cả sản phẩm
              </button>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => handleCategoryChange(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Search Results Info */}
        {(searchTerm || selectedCategory) && (
          <div className="text-center mb-6">
            <p className="text-gray-600">
              Tìm thấy <span className="font-semibold">{filteredProducts.length}</span> sản phẩm
              {searchTerm && ` cho từ khóa "${searchTerm}"`}
              {selectedCategory && selectedCategory !== 'all' && ` trong danh mục "${selectedCategory}"`}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Products Grid */}
        <div className="product-container">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😔</div>
              <p className="text-gray-500 text-lg mb-4">Không tìm thấy sản phẩm phù hợp.</p>
              {(searchTerm || selectedCategory) && (
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSearchTerm('');
                    setSearchParams({});
                  }}
                  className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product}
                  onViewDetails={handleViewDetails}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductDetailModal 
            product={selectedProduct}
            onClose={handleCloseDetails}
            isAuthenticated={isAuthenticated}
          />
        )}
      </div>
    </section>
  );
};

// Product Detail Modal Component - ĐÃ THÊM VÀO
const ProductDetailModal = ({ product, onClose, isAuthenticated }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="h-full w-full object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
              ) : (
                <div className="text-6xl text-gray-400">☕</div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <div>
                <span className="inline-block bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded">
                  {product.category}
                </span>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <div className="flex items-center space-x-4 mt-4">
                  <p className="text-2xl font-bold text-amber-600">
                    {product.price?.toLocaleString('vi-VN')}₫
                  </p>
                  {product.originalPrice && (
                    <p className="text-lg text-gray-500 line-through">
                      {product.originalPrice.toLocaleString('vi-VN')}₫
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Tồn kho: <span className="font-semibold">{product.stock || 0}</span>
                </p>
              </div>

              {isAuthenticated && (
                <div className="flex space-x-4">
                  <button className="flex-1 bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 transition-colors">
                    Thêm vào giỏ hàng
                  </button>
                  <button className="p-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
                    🤍
                  </button>
                </div>
              )}

              {/* Product Details */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-2">Thông tin sản phẩm</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Danh mục:</strong> {product.category}</p>
                  <p><strong>Tồn kho:</strong> {product.stock || 0}</p>
                  {product.tags && product.tags.length > 0 && (
                    <p><strong>Tags:</strong> {product.tags.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-8">
            <ReviewSection productId={product._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
import { cartAPI } from '../../services/api';

const ProductCard = ({ product, onViewDetails, isAuthenticated }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      await cartAPI.add(product._id, 1);
      alert(`Đã thêm ${product.name} vào giỏ hàng!`);
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Lỗi khi thêm vào giỏ hàng: ' + (error.response?.data?.message || 'Vui lòng thử lại'));
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm vào danh sách yêu thích!');
      navigate('/login');
      return;
    }
    // TODO: Implement wishlist functionality
    alert('Tính năng đang phát triển!');
  };

  const getTypeText = (category) => {
    const typeMap = {
      'coffee': 'Cà Phê',
      'tea': 'Trà',
      'bakery': 'Bánh Ngọt'
    };
    return typeMap[category] || category;
  };

  return (
    <div className="product bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="h-48 bg-amber-200 flex items-center justify-center relative">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-6xl">☕</div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-colors ${
            false // TODO: Replace with actual wishlist check
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white hover:bg-red-50 hover:text-red-600'
          }`}
        >
          {false ? '❤️' : '🤍'}
        </button>

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Nổi bật
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <div className="product-des space-y-2">
          <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
            {getTypeText(product.category)}
          </span>
          <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
          
          {/* Price */}
          <div className="flex items-center space-x-2">
            <h4 className="text-lg font-bold text-amber-600">
              {product.price?.toLocaleString('vi-VN')}₫
            </h4>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {product.originalPrice.toLocaleString('vi-VN')}₫
              </span>
            )}
          </div>

          {/* Stock Info */}
          <p className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
          </p>

          {/* Rating */}
          {product.averageRating && (
            <div className="flex items-center space-x-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-sm ${
                      star <= product.averageRating ? 'text-amber-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-600">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex space-x-2">
          <button 
            onClick={handleAddToCart}
            disabled={loading || product.stock === 0}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors text-sm ${
              loading || product.stock === 0
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-amber-600 text-white hover:bg-amber-700'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang thêm...
              </div>
            ) : product.stock === 0 ? (
              'Hết hàng'
            ) : (
              'Thêm vào giỏ'
            )}
          </button>
          
          <button 
            onClick={() => onViewDetails(product)}
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm"
          >
            👁️
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
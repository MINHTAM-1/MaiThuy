// SỬA LẠI IMPORT PATH
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { cartAPI } from '../../services/api'; 

const ProductCard = ({ product, onViewDetails, onAddToCart }) => {
  const { isAuthenticated } = useAuth();
  const [addingToCart, setAddingToCart] = useState(false);
  const [addToCartMessage, setAddToCartMessage] = useState('');

  const getTypeText = (type) => {
    const typeMap = {
      'Cà Phê Hạt': 'Cà Phê Hạt',
      'Cà Phê Bột': 'Cà Phê Bột', 
      'Cà Phê Túi Lọc': 'Cà Phê Túi Lọc'
    };
    return typeMap[type] || type;
  };

  // Lấy ảnh đầu tiên từ mảng images
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      const imagePath = product.images[0];
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      return `http://localhost:5000${imagePath}`;
    }
    return 'https://via.placeholder.com/300x200/FFD700/000000?text=No+Image';
  };

  const handleImageError = (e) => {
    console.log('Image failed to load:', product.images);
    e.target.src = 'https://via.placeholder.com/300x200/FFD700/000000?text=No+Image';
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setAddToCartMessage('Vui lòng đăng nhập để thêm vào giỏ hàng');
      setTimeout(() => setAddToCartMessage(''), 3000);
      return;
    }

    setAddingToCart(true);
    setAddToCartMessage('');

    try {
      const response = await cartAPI.add(product._id, 1);
      
      if (response.success) {
        setAddToCartMessage('Đã thêm vào giỏ hàng!');
        
        // Gọi callback nếu có
        if (onAddToCart) {
          onAddToCart(product);
        }
      } else {
        setAddToCartMessage(response.message || 'Thêm vào giỏ thất bại');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      setAddToCartMessage(error.message || 'Lỗi khi thêm vào giỏ hàng');
    } finally {
      setAddingToCart(false);
      setTimeout(() => setAddToCartMessage(''), 3000);
    }
  };

  return (
    <div className="product bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div 
        className="h-48 bg-gray-100 flex items-center justify-center cursor-pointer"
        onClick={() => onViewDetails && onViewDetails(product)}
      >
        <img 
          src={getProductImage()} 
          alt={product.name}
          className="h-full w-full object-cover"
          onError={handleImageError}
        />
      </div>
      
      <div className="p-4">
        <div className="product-des space-y-2">
          <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
            {getTypeText(product.type || product.category)}
          </span>
          <p className="font-semibold text-gray-900">
            {product.code && `${product.code}: `}{product.name}
          </p>
          <h4 className="text-lg font-bold text-amber-600">
            {product.price?.toLocaleString('vi-VN')} VNĐ
          </h4>
        </div>

        {/* Thông báo thêm vào giỏ */}
        {addToCartMessage && (
          <div className={`mt-2 text-sm p-2 rounded ${
            addToCartMessage.includes('thành công') || addToCartMessage.includes('Đã thêm') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {addToCartMessage}
          </div>
        )}

        <div className="mt-4 flex space-x-2">
          <button 
            onClick={handleAddToCart}
            disabled={addingToCart}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors text-sm ${
              addingToCart 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            {addingToCart ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang thêm...
              </span>
            ) : (
              'Thêm vào giỏ'
            )}
          </button>
          
          <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm">
            <i className='bx bx-heart'></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
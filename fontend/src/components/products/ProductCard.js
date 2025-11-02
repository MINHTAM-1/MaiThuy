const ProductCard = ({ product, onViewDetails, isAuthenticated }) => {
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
      // Thêm base URL nếu cần
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      return `http://localhost:5000${imagePath}`;
    }
    // Fallback image
    return 'https://via.placeholder.com/300x200/FFD700/000000?text=No+Image';
  };

  const handleImageError = (e) => {
    console.log('❌ Image failed to load:', product.images);
    e.target.src = 'https://via.placeholder.com/300x200/FFD700/000000?text=No+Image';
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
          onLoad={() => console.log('✅ Image loaded for:', product.name)}
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

        <div className="mt-4 flex space-x-2">
          <button className="flex-1 bg-amber-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors text-sm">
            Thêm vào giỏ
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
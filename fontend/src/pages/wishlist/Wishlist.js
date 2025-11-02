import { Link } from 'react-router-dom';
import useWishlistStore from '../../store/wishlistStore';
import useCartStore from '../../store/cartStore';

const Wishlist = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleAddToCart = (product) => {
    addItem(product);
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  const handleMoveAllToCart = () => {
    items.forEach(product => addItem(product));
    alert(`Đã thêm ${items.length} sản phẩm vào giỏ hàng!`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">❤️</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Danh sách yêu thích trống</h1>
            <p className="text-gray-600 mb-8">Hãy thêm sản phẩm bạn yêu thích vào danh sách!</p>
            <Link
              to="/products"
              className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Danh sách yêu thích</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleMoveAllToCart}
              className="bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Thêm tất cả vào giỏ
            </button>
            <button
              onClick={clearWishlist}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Xóa tất cả
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 bg-amber-200 flex items-center justify-center relative">
                <div className="text-6xl">☕</div>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  ❤️
                </button>
              </div>
              
              <div className="p-4">
                <div className="space-y-2">
                  <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
                    {product.type}
                  </span>
                  <p className="font-semibold text-gray-900">{product.code}: {product.name}</p>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <h4 className="text-lg font-bold text-amber-600">
                    {product.price.toLocaleString('vi-VN')} VNĐ
                  </h4>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-amber-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors text-sm"
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Tổng cộng {items.length} sản phẩm trong danh sách yêu thích</p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/products"
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
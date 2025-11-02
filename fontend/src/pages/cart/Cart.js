import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cartAPI } from '../../services/api';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      setCart(response.data.data);
    } catch (error) {
      console.error('Fetch cart error:', error);
      // If cart is empty or doesn't exist, set empty cart
      setCart({
        items: [],
        totalItems: 0,
        totalAmount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(true);
      await cartAPI.update(productId, newQuantity);
      await fetchCart(); // Refresh cart data
    } catch (error) {
      console.error('Update quantity error:', error);
      alert('Lỗi khi cập nhật số lượng: ' + (error.response?.data?.message || 'Vui lòng thử lại'));
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setUpdating(true);
      await cartAPI.remove(productId);
      await fetchCart(); // Refresh cart data
      alert('Đã xóa sản phẩm khỏi giỏ hàng!');
    } catch (error) {
      console.error('Remove item error:', error);
      alert('Lỗi khi xóa sản phẩm: ' + (error.response?.data?.message || 'Vui lòng thử lại'));
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
      return;
    }

    try {
      setUpdating(true);
      await cartAPI.clear();
      setCart({
        items: [],
        totalItems: 0,
        totalAmount: 0
      });
      alert('Đã xóa toàn bộ giỏ hàng!');
    } catch (error) {
      console.error('Clear cart error:', error);
      alert('Lỗi khi xóa giỏ hàng: ' + (error.response?.data?.message || 'Vui lòng thử lại'));
    } finally {
      setUpdating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Vui lòng đăng nhập</h1>
            <p className="text-gray-600 mb-8">Bạn cần đăng nhập để xem giỏ hàng của mình.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200"
              >
                Đăng nhập ngay
              </Link>
              <Link
                to="/products"
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h1>
            <p className="text-gray-600 mb-8">Hãy thêm một vài món ngon từ thực đơn của chúng tôi!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200"
              >
                Khám phá sản phẩm
              </Link>
              <Link
                to="/profile"
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
              >
                Xem đơn hàng cũ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
          <button
            onClick={clearCart}
            disabled={updating}
            className="text-red-600 hover:text-red-700 font-medium disabled:text-gray-400"
          >
            {updating ? 'Đang xóa...' : 'Xóa tất cả'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          {cart.items.map((item) => (
            <div key={item.productId} className="border-b border-gray-200 last:border-b-0">
              <div className="p-6 flex items-center space-x-4">
                {/* Product Image */}
                <div className="w-20 h-20 bg-amber-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.product?.images && item.product.images.length > 0 ? (
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-2xl">☕</span>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900">{item.product?.name || 'Đang tải...'}</h3>
                  <p className="text-amber-600 font-bold text-lg">
                    {item.product?.price ? item.product.price.toLocaleString('vi-VN') : 0}₫
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={updating || item.quantity <= 1}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={updating}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>

                {/* Total Price */}
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {item.product?.price ? (item.product.price * item.quantity).toLocaleString('vi-VN') : 0}₫
                  </p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    disabled={updating}
                    className="text-red-500 hover:text-red-700 text-sm mt-1 disabled:text-gray-400"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold">Tổng cộng ({cart.totalItems} sản phẩm):</span>
            <span className="text-2xl font-bold text-amber-600">
              {cart.totalAmount.toLocaleString('vi-VN')}₫
            </span>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/products"
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg text-center font-semibold hover:bg-gray-300 transition-colors duration-200"
            >
              Tiếp tục mua hàng
            </Link>
            <Link
              to="/checkout"
              className="flex-1 bg-amber-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-amber-700 transition-colors duration-200"
            >
              Thanh toán
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
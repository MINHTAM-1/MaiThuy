import { Link } from 'react-router-dom';
import { useCart } from '../store/cartStore';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h1>
            <p className="text-gray-600 mb-8">Hãy thêm một vài món ngon từ thực đơn của chúng tôi!</p>
            <Link
              to="/"
              className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200"
            >
              Khám phá thực đơn
            </Link>
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
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Xóa tất cả
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {items.map((item) => (
            <div key={item.id} className="border-b border-gray-200 last:border-b-0">
              <div className="p-6 flex items-center space-x-4">
                {/* Product Image */}
                <div className="w-20 h-20 bg-amber-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{item.emoji || '☕'}</span>
                </div>

                {/* Product Info */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-amber-600 font-bold text-lg">
                    {item.price.toLocaleString()}₫
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Total Price */}
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {(item.price * item.quantity).toLocaleString()}₫
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm mt-1"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold">Tổng cộng:</span>
            <span className="text-2xl font-bold text-amber-600">
              {getTotalPrice().toLocaleString()}₫
            </span>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/"
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
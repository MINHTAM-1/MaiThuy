import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { cartAPI } from "../../services/api";
import toast from 'react-hot-toast';
import confirmToast from "../../components/layout/ConfirmToast";
import Loading from "../../components/layout/Loading";
import ROUTES from "../../routes";

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { isAuthenticated, setCartContext } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) fetchCart();
    else setLoading(false);
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await cartAPI.get();
      setCart(res.data.data || { items: [] });
    } catch (err) {
      console.error("Fetch cart error:", err);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    // update local state trước
    setCart(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.productId._id === productId ? { ...item, quantity } : item
      )
    }));

    try {
      setUpdating(true);
      await cartAPI.updateItem(productId, quantity);
      const resCart = await cartAPI.get();
      setCartContext(resCart.data.data);
    } catch (err) {
      console.error("Update quantity error:", err);
      toast.error("Lỗi khi cập nhật số lượng: " + (err.response?.data?.message || "Vui lòng thử lại"));
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (productId) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(item => item.productId._id !== productId)
    }));

    try {
      setUpdating(true);
      await cartAPI.updateItem(productId, 0);
      const resCart = await cartAPI.get();
      setCartContext(resCart.data.data);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch (err) {
      console.error("Remove item error:", err);
      toast.error("Lỗi khi xóa sản phẩm: " + (err.response?.data?.message || "Vui lòng thử lại"));
    } finally {
      setUpdating(false);
    }
  };

  const clearCartHandler = async () => {
    const confirmed = await confirmToast({ textConfirm: "Bạn có chắc muốn xóa toàn bộ giỏ hàng?" });
    if (!confirmed) return;

    try {
      setUpdating(true);
      await cartAPI.clear();
      setCart({ items: [] });
      toast.success("Đã xóa toàn bộ giỏ hàng!");
    } catch (err) {
      console.error("Clear cart error:", err);
      toast.error("Lỗi khi xóa giỏ hàng: " + (err.response?.data?.message || "Vui lòng thử lại"));
    } finally {
      setUpdating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold mb-4">Vui lòng đăng nhập</h1>
          <p className="text-gray-600 mb-8">Bạn cần đăng nhập để xem giỏ hàng của mình.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700">Đăng nhập ngay</Link>
            <Link to="/products" className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300">Tiếp tục mua sắm</Link>
          </div>
        </div>
      </div>
    );
  }

  const getFinalPrice = (product) => {
    const price = product?.price || 0;
    const discount = product?.discount || 0;
    return price * (1 - discount / 100);
  };

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.items.reduce(
    (sum, item) => sum + getFinalPrice(item.productId) * item.quantity,
    0
  );

  const cartWithFinalPrice = {
  ...cart,
  items: cart.items.map(item => ({
    ...item,
    finalPrice: getFinalPrice(item.productId), // giá sau giảm
    totalPrice: getFinalPrice(item.productId) * item.quantity
  }))
};

if (loading) return (
    <Loading />
  );

  if (!cart.items || cart.items.length === 0) return (
    <div className="min-h-screen bg-gray-50 py-12 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-3xl font-bold mb-4">Giỏ hàng trống</h1>
        <p className="text-gray-600 mb-8">Hãy thêm một vài món ngon từ thực đơn của chúng tôi!</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={ROUTES.PRODUCTS} className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700">Khám phá sản phẩm</Link>
          <Link to={ROUTES.ORDERS} className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300">Xem đơn hàng cũ</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Giỏ hàng của bạn</h1>
          <button onClick={clearCartHandler} disabled={updating} className="text-red-600 hover:text-red-700 font-medium disabled:text-gray-400">
            {updating ? "Đang xóa..." : "Xóa tất cả"}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          {cart.items.map((item) => (
            <div key={item.productId._id} className="border-b border-gray-200 last:border-b-0">
              <div className="p-6 flex items-center space-x-4">
                <div className="w-20 h-20 bg-amber-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.productId?.images?.[0] ? (
                    <img src={item.productId.images[0]} alt={item.productId.name} className="w-full h-full object-cover rounded-lg" />
                  ) : <span className="text-2xl">☕</span>}
                </div>

                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">
                    {item.productId?.name || "Đang tải..."}
                  </h3>

                  {item.productId?.discount > 0 ? (
                    <div className="flex items-center gap-2">
                      {/* Giá sau giảm */}
                      <p className="text-amber-600 font-bold text-lg">
                        {getFinalPrice(item.productId).toLocaleString("vi-VN")}₫
                      </p>

                      {/* Giá gốc */}
                      <p className="text-gray-500 line-through text-sm">
                        {item.productId.price.toLocaleString("vi-VN")}₫
                      </p>

                      {/* % giảm */}
                      <span className="text-red-500 text-sm font-semibold">
                        -{item.productId.discount}%
                      </span>
                    </div>
                  ) : (
                    <p className="text-amber-600 font-bold text-lg">
                      {item.productId?.price?.toLocaleString("vi-VN") || 0}₫
                    </p>
                  )}
                </div>


                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                    disabled={updating || item.quantity <= 1}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center 
                      hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed">-</button>
                  <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                    disabled={updating}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center 
                      hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed">+</button>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold">{(getFinalPrice(item.productId) * item.quantity).toLocaleString("vi-VN")}₫</p>
                  <button onClick={() => removeItem(item.productId._id)} disabled={updating} className="text-red-500 hover:text-red-700 text-sm mt-1 disabled:text-gray-400">Xóa</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold">Tổng cộng ({totalItems} sản phẩm):</span>
            <span className="text-2xl font-bold text-amber-600">{totalAmount.toLocaleString("vi-VN")}₫</span>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate(ROUTES.PRODUCTS)}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg text-center font-semibold hover:bg-gray-300"
            >
              Tiếp tục mua hàng
            </button>
            <button
              onClick={() => navigate(ROUTES.CHECKOUT, { state: { cart: cartWithFinalPrice } })}
              className="flex-1 bg-amber-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-amber-700"
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
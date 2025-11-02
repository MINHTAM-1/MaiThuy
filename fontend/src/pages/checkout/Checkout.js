import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import { ordersAPI } from '../../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: '',
    paymentMethod: 'cod'
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Vui lòng đăng nhập để đặt hàng!');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        orderItems: items.map(item => ({
          product: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.city}`,
          city: formData.city,
          district: formData.district,
          ward: formData.ward
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: getTotalPrice(),
        shippingPrice: 15000,
        taxPrice: 0,
        totalPrice: getTotalPrice() + 15000,
        note: formData.note
      };

      const response = await ordersAPI.create(orderData);
      
      if (response.data) {
        alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng tại MAITHUY COFFEE.');
        clearCart();
        navigate(`/orders/${response.data._id}`);
      }
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h1>
            <p className="text-gray-600 mb-8">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
            <Link
              to="/products"
              className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200"
            >
              Quay lại mua hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shippingFee = 15000;
  const totalPrice = getTotalPrice() + shippingFee;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Thông tin giao hàng</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields remain the same */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* ... other form fields ... */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200 disabled:bg-amber-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : 'Hoàn tất đặt hàng'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold mb-6">Đơn hàng của bạn</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-amber-200 rounded flex items-center justify-center">
                      <span className="text-sm">☕</span>
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{getTotalPrice().toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between">
                <span>Phí giao hàng:</span>
                <span>{shippingFee.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                <span>Tổng cộng:</span>
                <span className="text-amber-600">
                  {totalPrice.toLocaleString('vi-VN')}₫
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
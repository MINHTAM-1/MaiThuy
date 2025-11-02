import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { updateUser } = useAuthStore();

  useEffect(() => {
    fetchUserData();
    fetchUserOrders();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await usersAPI.getProfile();
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin user:', error);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const response = await usersAPI.getOrderHistory();
      if (response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await usersAPI.updateProfile(user);
      if (response.data) {
        updateUser(response.data);
        setIsEditing(false);
        alert('Thông tin đã được cập nhật!');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin.');
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': { text: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
      'confirmed': { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
      'shipping': { text: 'Đang giao hàng', color: 'bg-blue-100 text-blue-800' },
      'delivered': { text: 'Đã giao hàng', color: 'bg-green-100 text-green-800' },
      'cancelled': { text: 'Đã hủy', color: 'bg-red-100 text-red-800' }
    };
    return statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Không tìm thấy thông tin người dùng</h2>
          <Link to="/login" className="text-amber-600 hover:text-amber-700">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-amber-800">
                {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">
                Thành viên từ {new Date(user.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📝 Thông tin cá nhân
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  🛒 Đơn hàng của tôi
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'password'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  🔐 Đổi mật khẩu
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Chỉnh sửa
                    </button>
                  ) : (
                    <div className="space-x-2">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          fetchUserData(); // Reset data
                        }}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleSave}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        Lưu thay đổi
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={user.name || ''}
                      onChange={(e) => setUser({...user, name: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={user.phone || ''}
                      onChange={(e) => setUser({...user, phone: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ
                    </label>
                    <textarea
                      value={user.address || ''}
                      onChange={(e) => setUser({...user, address: e.target.value})}
                      disabled={!isEditing}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Đơn hàng của tôi</h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-gray-500 text-lg mb-4">Bạn chưa có đơn hàng nào.</p>
                    <Link
                      to="/products"
                      className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Mua sắm ngay
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const statusInfo = getStatusText(order.orderStatus);
                      return (
                        <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900">Đơn hàng #{order._id.slice(-8).toUpperCase()}</h3>
                              <p className="text-sm text-gray-500">
                                Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                              {statusInfo.text}
                            </span>
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 mb-2">Sản phẩm:</p>
                            {order.orderItems.slice(0, 2).map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.name} x {item.quantity}</span>
                                <span>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                              </div>
                            ))}
                            {order.orderItems.length > 2 && (
                              <p className="text-sm text-gray-500 mt-1">
                                +{order.orderItems.length - 2} sản phẩm khác
                              </p>
                            )}
                          </div>
                          
                          <div className="flex justify-between items-center border-t pt-3">
                            <div>
                              <p className="text-sm text-gray-600">Địa chỉ giao hàng:</p>
                              <p className="text-sm font-medium">{order.shippingAddress?.address}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-amber-600">
                                {order.totalPrice.toLocaleString('vi-VN')}₫
                              </p>
                              <Link 
                                to={`/orders/${order._id}`}
                                className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                              >
                                Xem chi tiết
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Đổi mật khẩu</h2>
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <button className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors">
                    Đổi mật khẩu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
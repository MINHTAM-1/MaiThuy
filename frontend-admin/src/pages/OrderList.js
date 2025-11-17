import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../services/api';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sử dụng useCallback để memoize fetchOrders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Fetching orders...');
      const response = await adminAPI.getAllOrders();
      console.log('📦 Orders API Response:', response.data);
      
      if (response.data) {
        // Xử lý nhiều cấu trúc response khác nhau
        let ordersData = [];
        
        if (response.data.success && response.data.data) {
          ordersData = response.data.data;
        } else if (response.data.orders) {
          ordersData = response.data.orders;
        } else if (Array.isArray(response.data)) {
          ordersData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          ordersData = response.data.data;
        } else {
          console.warn('⚠️ Unexpected orders response structure:', response.data);
        }
        
        // Đảm bảo ordersData là array
        if (Array.isArray(ordersData)) {
          setOrders(ordersData);
        } else {
          console.warn('⚠️ Orders data is not an array:', ordersData);
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('❌ Lỗi khi lấy danh sách đơn hàng:', error);
      setError('Không thể tải danh sách đơn hàng');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusText = (status) => {
    const statusMap = {
      'pending': { text: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800', badge: '🕒' },
      'confirmed': { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', badge: '✓' },
      'shipping': { text: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800', badge: '🚚' },
      'delivered': { text: 'Đã giao hàng', color: 'bg-green-100 text-green-800', badge: '✅' },
      'cancelled': { text: 'Đã hủy', color: 'bg-red-100 text-red-800', badge: '❌' }
    };
    return statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800', badge: '❓' };
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      ));
      alert(`Đã cập nhật trạng thái đơn hàng thành ${getStatusText(newStatus).text}`);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái!');
    }
  };

  // Đảm bảo orders là array trước khi filter
  const filteredOrders = Array.isArray(orders) ? orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.orderStatus === filterStatus;
    const orderId = order._id || order.id || '';
    const customerName = order.shippingAddress?.fullName || order.customerName || '';
    const phone = order.shippingAddress?.phone || order.phone || '';
    
    const matchesSearch = orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  }) : [];

  const getStats = () => {
    if (!Array.isArray(orders)) {
      return { total: 0, pending: 0, shipping: 0, completed: 0, revenue: 0 };
    }

    const total = orders.length;
    const pending = orders.filter(o => o.orderStatus === 'pending').length;
    const shipping = orders.filter(o => o.orderStatus === 'shipping').length;
    const completed = orders.filter(o => o.orderStatus === 'delivered').length;
    const revenue = orders.filter(o => o.orderStatus === 'delivered')
                         .reduce((sum, order) => sum + (order.totalPrice || order.totalAmount || 0), 0);

    return { total, pending, shipping, completed, revenue };
  };

  const stats = getStats();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="text-gray-600 mt-2">Quản lý và theo dõi tất cả đơn hàng trong hệ thống</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <span className="text-white text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500">
              <span className="text-white text-2xl">🕒</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <span className="text-white text-2xl">🚚</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang giao</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.shipping}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <span className="text-white text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã giao</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-amber-500">
              <span className="text-white text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Doanh thu</p>
              <p className="text-2xl font-semibold text-gray-900">{(stats.revenue / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Chờ xử lý
            </button>
            <button
              onClick={() => setFilterStatus('shipping')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'shipping'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Đang giao
            </button>
            <button
              onClick={() => setFilterStatus('delivered')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'delivered'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Đã giao
            </button>
          </div>
          <div className="lg:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn, tên KH..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-gray-500 text-lg">Không tìm thấy đơn hàng nào.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = getStatusText(order.orderStatus || order.status);
                  const orderId = order._id || order.id;
                  const customerName = order.shippingAddress?.fullName || order.customerName || 'Khách hàng';
                  const phone = order.shippingAddress?.phone || order.phone || '';
                  const totalAmount = order.totalPrice || order.totalAmount || 0;
                  
                  return (
                    <tr key={orderId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{orderId?.slice(-8).toUpperCase() || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">{order.paymentMethod || 'COD'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {customerName}
                        </div>
                        <div className="text-sm text-gray-500">{phone}</div>
                        <div className="text-sm text-gray-500">{order.shippingAddress?.email || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <span className="mr-1">{statusInfo.badge}</span>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => updateOrderStatus(orderId, 'confirmed')}
                          className="text-blue-600 hover:text-blue-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                          disabled={order.orderStatus !== 'pending'}
                        >
                          Xác nhận
                        </button>
                        <button
                          onClick={() => updateOrderStatus(orderId, 'shipping')}
                          className="text-purple-600 hover:text-purple-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                          disabled={!['pending', 'confirmed'].includes(order.orderStatus)}
                        >
                          Giao hàng
                        </button>
                        <button
                          onClick={() => updateOrderStatus(orderId, 'delivered')}
                          className="text-green-600 hover:text-green-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                          disabled={order.orderStatus !== 'shipping'}
                        >
                          Hoàn thành
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
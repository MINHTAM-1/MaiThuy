import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';


const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    todayOrders: 0,
    monthlyRevenue: 0,
    newCustomers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔄 Fetching dashboard data...');
      
      const [statsResponse, ordersResponse, productsResponse] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getAllOrders({ page: 1, limit: 5, sort: '-createdAt' }),
        adminAPI.getTopProducts({ limit: 5 })
      ]);

      console.log('📊 Dashboard API Responses:', {
        stats: statsResponse.data,
        orders: ordersResponse.data,
        products: productsResponse.data
      });

      // Xử lý stats data
      if (statsResponse.data?.success) {
        const statsData = statsResponse.data.data || statsResponse.data;
        setStats({
          totalProducts: statsData.totalProducts || statsData.overview?.totalProducts || 0,
          todayOrders: statsData.todayOrders || statsData.orders?.today || 0,
          monthlyRevenue: statsData.monthlyRevenue || statsData.overview?.totalRevenue || 0,
          newCustomers: statsData.newCustomers || statsData.overview?.totalUsers || 0
        });
      }

      // Xử lý recent orders
      if (ordersResponse.data?.success) {
        const ordersData = ordersResponse.data.data || ordersResponse.data.orders || ordersResponse.data;
        setRecentOrders(Array.isArray(ordersData) ? ordersData : []);
      } else if (ordersResponse.data && Array.isArray(ordersResponse.data)) {
        setRecentOrders(ordersResponse.data);
      }

      // Xử lý top products
      if (productsResponse.data?.success) {
        const productsData = productsResponse.data.data || productsResponse.data.products || productsResponse.data;
        setTopProducts(Array.isArray(productsData) ? productsData : []);
      } else if (productsResponse.data && Array.isArray(productsResponse.data)) {
        setTopProducts(productsResponse.data);
      }

    } catch (error) {
      console.error('❌ Lỗi khi lấy dữ liệu dashboard:', error);
      setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    { 
      label: 'Tổng sản phẩm', 
      value: stats.totalProducts.toLocaleString(), 
      icon: '☕', 
      color: 'bg-blue-500', 
      link: '/admin/products' 
    },
    { 
      label: 'Đơn hàng hôm nay', 
      value: stats.todayOrders.toLocaleString(), 
      icon: '📦', 
      color: 'bg-green-500', 
      link: '/admin/orders' 
    },
    { 
      label: 'Doanh thu tháng', 
      value: `${(stats.monthlyRevenue / 1000000).toFixed(1)}M VNĐ`, 
      icon: '💰', 
      color: 'bg-amber-500' 
    },
    { 
      label: 'Khách hàng mới', 
      value: stats.newCustomers.toLocaleString(), 
      icon: '👥', 
      color: 'bg-purple-500' 
    }
  ];

  const quickActions = [
    { label: 'Thêm sản phẩm', path: '/admin/products/add', icon: '➕' },
    { label: 'Quản lý sản phẩm', path: '/admin/products', icon: '📦' },
    { label: 'Quản lý đơn hàng', path: '/admin/orders', icon: '📋' },
    { label: 'Xem báo cáo', path: '/admin/dashboard', icon: '📊' }
  ];

  const getStatusText = (status) => {
    const statusMap = {
      'pending': { text: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800', badge: '🕒' },
      'confirmed': { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', badge: '✓' },
      'processing': { text: 'Đang xử lý', color: 'bg-blue-100 text-blue-800', badge: '⚡' },
      'shipping': { text: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800', badge: '🚚' },
      'delivered': { text: 'Đã giao hàng', color: 'bg-green-100 text-green-800', badge: '✅' },
      'completed': { text: 'Hoàn thành', color: 'bg-green-100 text-green-800', badge: '✅' },
      'cancelled': { text: 'Đã hủy', color: 'bg-red-100 text-red-800', badge: '❌' }
    };
    return statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800', badge: '❓' };
  };

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
          <p className="text-gray-600">Đang tải dữ liệu...</p>
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
            onClick={fetchDashboardData}
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Tổng quan về hoạt động cửa hàng</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <Link 
            key={index} 
            to={stat.link || '#'} 
            className="block hover:transform hover:scale-105 transition-transform duration-200"
          >
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <span className="text-white text-2xl">{stat.icon}</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors group"
            >
              <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">{action.icon}</span>
              <span className="font-medium text-gray-700 group-hover:text-amber-700">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Đơn hàng gần đây</h2>
            <Link to="/admin/orders" className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center">
              Xem tất cả <span className="ml-1">→</span>
            </Link>
          </div>
          
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📦</div>
              <p className="text-gray-500">Chưa có đơn hàng nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.slice(0, 5).map((order, index) => {
                const statusInfo = getStatusText(order.status || order.orderStatus);
                const orderId = order._id || order.id || `order-${index}`;
                const customerName = order.shippingAddress?.fullName || 
                                   order.customerName || 
                                   order.userId?.name || 
                                   'Khách hàng';
                const totalAmount = order.totalAmount || order.totalPrice || 0;

                return (
                  <div key={orderId} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border hover:bg-white transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-gray-900 truncate">
                          #{orderId.slice(-8).toUpperCase()}
                        </p>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.color}`}>
                          <span className="mr-1">{statusInfo.badge}</span>
                          {statusInfo.text}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{customerName}</p>
                      <p className="text-sm font-semibold text-amber-600">
                        {formatCurrency(totalAmount)}
                      </p>
                      {order.createdAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(order.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Sản phẩm bán chạy</h2>
            <Link to="/admin/products" className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center">
              Xem tất cả <span className="ml-1">→</span>
            </Link>
          </div>

          {topProducts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-gray-500">Chưa có dữ liệu sản phẩm</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.slice(0, 5).map((product, index) => {
                const productId = product._id || product.id || `product-${index}`;
                const productName = product.name || product.ten_sp || 'Sản phẩm';
                const soldCount = product.totalSold || product.soldCount || product.quantity || 0;
                const productImage = product.images?.[0] || product.image;

                return (
                  <div key={productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-white transition-colors">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {productImage ? (
                        <img 
                          src={productImage} 
                          alt={productName}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                          <span className="text-amber-600 text-lg">☕</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{productName}</p>
                        <p className="text-sm text-gray-500">
                          Đã bán: <span className="font-semibold">{soldCount}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-amber-600">
                        {soldCount.toLocaleString()} lượt
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-8 text-center">
        <button
          onClick={fetchDashboardData}
          className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors inline-flex items-center"
        >
          <span className="mr-2">🔄</span>
          Làm mới dữ liệu
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
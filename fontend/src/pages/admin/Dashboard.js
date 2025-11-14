import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

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

      console.log('Fetching dashboard data...');
      
      const [statsResponse, ordersResponse, productsResponse] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getAllOrders({ page: 1, limit: 5, sort: '-createdAt' }),
        adminAPI.getTopProducts({ limit: 5 })
      ]);

      console.log('Dashboard API Responses:', {
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
      console.error('Lỗi khi lấy dữ liệu dashboard:', error);
      setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    { 
      label: 'Tổng sản phẩm', 
      value: stats.totalProducts.toLocaleString(), 
      color: 'bg-blue-500', 
      link: '/admin/products' 
    },
    { 
      label: 'Đơn hàng hôm nay', 
      value: stats.todayOrders.toLocaleString(), 
      color: 'bg-green-500', 
      link: '/admin/orders' 
    },
    { 
      label: 'Doanh thu tháng', 
      value: `${(stats.monthlyRevenue / 1000000).toFixed(1)}M VNĐ`, 
      color: 'bg-amber-500' 
    },
    { 
      label: 'Khách hàng mới', 
      value: stats.newCustomers.toLocaleString(), 
      color: 'bg-purple-500' 
    }
  ];

  const quickActions = [
    { label: 'Thêm sản phẩm', path: '/admin/products/add' },
    { label: 'Quản lý sản phẩm', path: '/admin/products' },
    { label: 'Quản lý đơn hàng', path: '/admin/orders' },
    { label: 'Xem báo cáo', path: '/admin/dashboard' }
  ];

  const getStatusText = (status) => {
    const statusMap = {
      'pending': { text: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
      'confirmed': { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
      'processing': { text: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
      'shipping': { text: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800' },
      'delivered': { text: 'Đã giao hàng', color: 'bg-green-100 text-green-800' },
      'completed': { text: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
      'cancelled': { text: 'Đã hủy', color: 'bg-red-100 text-red-800' }
    };
    return statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
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
          <svg xmlns="http://www.w3.org/2000/svg" className="animate-spin h-12 w-12 text-amber-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 4.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM2.25 12a9.75 9.75 0 1119.5 0 9.75 9.75 0 01-19.5 0z" fill="currentColor"/>
            <path d="M12 4.5a7.5 7.5 0 017.5 7.5h3a10.5 10.5 0 00-21 0h3a7.5 7.5 0 017.5-7.5z" fill="currentColor"/>
          </svg>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
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
                  {index === 0 && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  )}
                  {index === 3 && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  )}
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
              {index === 0 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-600 group-hover:text-amber-600 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )}
              {index === 1 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-600 group-hover:text-amber-600 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              )}
              {index === 2 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-600 group-hover:text-amber-600 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              )}
              {index === 3 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-600 group-hover:text-amber-600 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
              )}
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
              Xem tất cả
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
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
              Xem tất cả
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          {topProducts.length === 0 ? (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                          </svg>
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Làm mới dữ liệu
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
import { useState, useEffect, useCallback } from 'react';
import { ordersAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading';
import { useNavigate } from 'react-router-dom';
import OrderFilters from '../../components/OrderFilters';
import OrdersTable from '../../components/OrdersTable';
import OrderStatsOverview from '../../components/OrderStatsOverview';
import Pagination from '../../components/Pagination';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async (pageNumber = page) => {
    try {
      setLoading(true);
      setError('');
      const response = await ordersAPI.getAll({ page: pageNumber });
      if (response.data.success) {
        const data = response.data.data.data;
        setOrders(data || []);
        setTotalPages(data.totalPages || 1);
      } else {
        setOrders([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('❌ Lỗi khi lấy danh sách đơn hàng:', err);
      setError('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchOrders(page);
  }, [fetchOrders, page]);

  useEffect(() => {
    const filtered = orders.filter(order => {
      const matchesStatus = filterStatus === 'all' || order.orderStatus === filterStatus;
      const orderId = order._id || order.id || '';
      const customerName = order.shippingAddress?.recipientName || '';
      const phone = order.shippingAddress?.phone || '';
      const matchesSearch = orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm);
      return matchesStatus && matchesSearch;
    });
    setFilteredOrders(filtered);
  }, [orders, filterStatus, searchTerm]);

  const getStatusText = (status) => {
    const statusMap = {
      'PENDING': { text: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800', badge: '🕒' },
      'CONFIRMED': { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', badge: '✓' },
      'SHIPPING': { text: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800', badge: '🚚' },
      'DELIVERED': { text: 'Đã giao hàng', color: 'bg-green-100 text-green-800', badge: '✅' },
      'CANCELLED': { text: 'Đã hủy', color: 'bg-red-100 text-red-800', badge: '❌' }
    };
    return statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800', badge: '❓' };
  };

  const getPaymentStatusText = (status) => {
    const statusMap = {
      'PENDING': { text: 'Chưa thanh toán', color: 'bg-yellow-100 text-yellow-800', badge: '🕒' },
      'PAID': { text: 'Đã thanh toán', color: 'bg-green-100 text-green-800', badge: '✅' },
      'FAILED': { text: 'Thanh toán thất bại', color: 'bg-red-100 text-red-800', badge: '❌' }
    };
    return statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800', badge: '❓' };
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.update(orderId, { orderStatus: newStatus });
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      ));
      toast.success(`Đã cập nhật trạng thái đơn hàng thành ${getStatusText(newStatus).text}`);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };

  const updatePaymentStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.update(orderId, { paymentStatus: newStatus });
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, paymentStatus: newStatus } : order
      ));
      toast.success(`Đã cập nhật trạng thái thanh toán thành ${getStatusText(newStatus).text}`);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  if (loading) return <Loading />;

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
      <OrderStatsOverview orders={orders} />

      {/* Filters and Search */}
      <OrderFilters
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Orders Table */}
      <OrdersTable
        filteredOrders={filteredOrders}
        navigate={navigate}
        updateOrderStatus={updateOrderStatus}
        updatePaymentStatus={updatePaymentStatus}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
        getStatusText={getStatusText}
        getPaymentStatusText={getPaymentStatusText}
      />

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
};

export default OrderList;
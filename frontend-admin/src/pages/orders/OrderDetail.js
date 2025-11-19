import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ordersAPI } from '../../services/api';
import Loading from '../../components/Loading';
import OrderTimeline from '../../components/OrderTimeline';
import toast from 'react-hot-toast';
import ROUTES from '../../routes';

const OrderDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState({});

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await ordersAPI.getById(id);
        if (response.data.success) {
          const orderData = response.data.data;
          setOrder(orderData);
          console.log(orderData)
        } else {
          setOrder([]);
        }
      } catch (error) {
        console.error('❌ Lỗi khi lấy chi tiết đơn hàng:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

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

  const updateOrderStatus = async (newStatus) => {
    try {
      const res = await ordersAPI.update(id, { orderStatus: newStatus });
      const updatedOrder = res.data.data;

      // Cập nhật state order với orderStatus và timestamp mới
      setOrder(prev => ({
        ...prev,
        orderStatus: updatedOrder.orderStatus,
        // Các timestamp tương ứng cũng cập nhật
        confirmedTimestamp: updatedOrder.confirmedTimestamp,
        shippingTimestamp: updatedOrder.shippingTimestamp,
        deliveredTimestamp: updatedOrder.deliveredTimestamp,
        cancelledTimestamp: updatedOrder.cancelledTimestamp,
      }));

      toast.success(`Đã cập nhật trạng thái đơn hàng thành ${getStatusText(newStatus).text}`);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };

const updatePaymentStatus = async (newStatus) => {
    try {
      const res = await ordersAPI.update(id, { paymentStatus: newStatus });
      const updatedOrder = res.data.data;

      setOrder(prev => ({
        ...prev,
        paymentStatus: updatedOrder.paymentStatus,
        paidTimestamp: updatedOrder.paidTimestamp,
        failedTimestamp: updatedOrder.failedTimestamp,
      }));

      toast.success(`Đã cập nhật trạng thái thanh toán thành ${getStatusText(newStatus).text}`);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };

  const statusInfo = getStatusText(order.orderStatus);
  if (loading) {
    return (
      <Loading />
    );
  }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <Link to={ROUTES.ORDERS} className="text-amber-600 hover:text-amber-700 mb-2 inline-block">
                ← Quay lại danh sách đơn hàng
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng #{order._id}</h1>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
              <span className="mr-1">{statusInfo.badge}</span>
              {statusInfo.text}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Info & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-amber-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.images[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name || "product image"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                      </p>
                      <p className="text-sm text-gray-500">{item.price.toLocaleString('vi-VN')}₫/sản phẩm</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tạm tính:</span>
                  <span>{(order.totalAmount - 15000 + order.discountAmount).toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Phí vận chuyển:</span>
                  <span>15.000₫</span>
                </div>
                {order.discountAmount !== 0 &&
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Giảm giá khuyến mãi:</span>
                    <span>- {order.discountAmount.toLocaleString('vi-VN')}₫</span>
                  </div>
                }
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
                  <span>Tổng cộng:</span>
                  <span className="text-amber-600">{order.totalAmount.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <OrderTimeline order={order} />
          </div>

          {/* Right Column - Customer Info & Actions */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin khách hàng</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Họ tên</p>
                  <p className="font-medium">{order.shippingAddress.recipientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại</p>
                  <p className="font-medium">{order.shippingAddress.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Địa chỉ giao hàng</p>
                  <p className="font-medium">{order.shippingAddress.detail}, {order.shippingAddress.ward},
                    {order.shippingAddress.district}, {order.shippingAddress.province}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phương thức thanh toán</p>
                  <p className="font-medium">{order.paymentMethod}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
              <div className="space-y-2">
                  <button
                    onClick={() => updateOrderStatus('CONFIRMED')}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors
                    disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={order.orderStatus !== 'PENDING'}
                  >
                    ✓ Xác nhận đơn hàng
                  </button>
                  <button
                    onClick={() => updateOrderStatus('SHIPPING')}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg disabled:bg-gray-400 
                    disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                    disabled={!['PENDING', 'CONFIRMED'].includes(order.orderStatus)}
                  >
                    🚚 Chuyển sang giao hàng
                  </button>
                  <button
                    onClick={() => updateOrderStatus('DELIVERED')}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors
                    disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={order.orderStatus !== 'SHIPPING'}
                  >
                    ✅ Đánh dấu đã giao
                  </button>
                
                  <>
                  <button
                    onClick={() => updatePaymentStatus('PAID')}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors
                    disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!['PENDING'].includes(order.paymentStatus)}
                  >
                    ✅ Đánh dấu đã thanh toán
                  </button>
                  <button
                    onClick={() => updatePaymentStatus('FAILED')}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors
                    disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!['PENDING'].includes(order.paymentStatus)}
                  >
                    ❌ Thanh toán thất bại
                  </button>
                  </>
                {/* <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                  📧 Gửi email cho KH
                </button>
                <button className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors">
                  🖨️ In hóa đơn
                </button> */}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin đơn hàng</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian đặt:</span>
                  <span className="font-medium">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số sản phẩm:</span>
                  <span className="font-medium">{order.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng số lượng:</span>
                  <span className="font-medium">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.text}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetail;
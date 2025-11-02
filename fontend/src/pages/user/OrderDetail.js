import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { ordersAPI } from '../../services/api';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetail = useCallback(async () => {
    try {
      const response = await ordersAPI.getById(orderId);
      if (response.data) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

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

  const getTimeline = (order) => {
    const timeline = [];
    
    timeline.push({
      status: 'ordered',
      text: 'Đơn hàng đã đặt',
      date: new Date(order.createdAt).toLocaleString('vi-VN')
    });

    if (order.confirmedAt) {
      timeline.push({
        status: 'confirmed',
        text: 'Đơn hàng đã xác nhận',
        date: new Date(order.confirmedAt).toLocaleString('vi-VN')
      });
    }

    if (order.shippedAt) {
      timeline.push({
        status: 'shipping',
        text: 'Đang giao hàng',
        date: new Date(order.shippedAt).toLocaleString('vi-VN')
      });
    }

    if (order.deliveredAt) {
      timeline.push({
        status: 'completed',
        text: 'Giao hàng thành công',
        date: new Date(order.deliveredAt).toLocaleString('vi-VN')
      });
    }

    if (order.cancelledAt) {
      timeline.push({
        status: 'cancelled',
        text: 'Đơn hàng đã hủy',
        date: new Date(order.cancelledAt).toLocaleString('vi-VN')
      });
    }

    return timeline;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Không tìm thấy đơn hàng</h2>
          <Link to="/profile" className="text-amber-600 hover:text-amber-700">
            Quay lại trang cá nhân
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusText(order.orderStatus);
  const timeline = getTimeline(order);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link to="/profile" className="text-amber-600 hover:text-amber-700 mb-2 inline-block">
              ← Quay lại trang cá nhân
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Chi tiết đơn hàng #{order._id.slice(-8).toUpperCase()}
            </h1>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
            {statusInfo.text}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm</h2>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-amber-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">☕</span>
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
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử đơn hàng</h2>
              <div className="space-y-4">
                {timeline.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === timeline.length - 1 ? 'bg-amber-600' : 'bg-gray-300'
                    }`}>
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{step.text}</p>
                      <p className="text-sm text-gray-500">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Info Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin đơn hàng</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày đặt:</span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức thanh toán:</span>
                  <span className="font-medium">
                    {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Địa chỉ giao hàng:</span>
                  <span className="font-medium text-right">
                    {order.shippingAddress?.address}
                  </span>
                </div>
                {order.shippingAddress?.phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">SĐT nhận hàng:</span>
                    <span className="font-medium">{order.shippingAddress.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tổng thanh toán</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>{order.itemsPrice?.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span>{order.shippingPrice?.toLocaleString('vi-VN')}₫</span>
                </div>
                {order.taxPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thuế:</span>
                    <span>{order.taxPrice?.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Tổng cộng:</span>
                  <span className="text-amber-600">
                    {order.totalPrice?.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác</h2>
              <div className="space-y-2">
                <Link
                  to="/products"
                  className="block w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors text-center"
                >
                  Mua lại đơn hàng
                </Link>
                <button className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                  In hóa đơn
                </button>
                {order.orderStatus === 'pending' && (
                  <button 
                    onClick={async () => {
                      if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
                        try {
                          await ordersAPI.cancel(order._id);
                          fetchOrderDetail(); // Refresh data
                          alert('Đơn hàng đã được hủy thành công!');
                        } catch (error) {
                          alert('Có lỗi xảy ra khi hủy đơn hàng!');
                        }
                      }
                    }}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Hủy đơn hàng
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
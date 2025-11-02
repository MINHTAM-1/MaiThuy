import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState({
    id: orderId,
    customerName: 'Nguyễn Văn A',
    customerPhone: '0123 456 789',
    customerEmail: 'nguyena@email.com',
    date: '2024-01-15',
    status: 'pending',
    total: 450000,
    shippingFee: 15000,
    subtotal: 435000,
    paymentMethod: 'Thanh toán khi nhận hàng',
    shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
    items: [
      { id: 1, name: 'Arabica Mật Ong', quantity: 2, price: 150000, image: '☕' },
      { id: 2, name: 'Robusta Premium', quantity: 1, price: 120000, image: '☕' }
    ],
    timeline: [
      { status: 'ordered', text: 'Đơn hàng đã đặt', date: '2024-01-15 10:30', admin: 'System' },
    ]
  });

  const [note, setNote] = useState('');

  const getStatusText = (status) => {
    const statusMap = {
      'pending': { text: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800', badge: '🕒' },
      'confirmed': { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', badge: '✓' },
      'shipping': { text: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800', badge: '🚚' },
      'completed': { text: 'Đã giao hàng', color: 'bg-green-100 text-green-800', badge: '✅' },
      'cancelled': { text: 'Đã hủy', color: 'bg-red-100 text-red-800', badge: '❌' }
    };
    return statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800', badge: '❓' };
  };

  const updateOrderStatus = (newStatus) => {
    const statusInfo = getStatusText(newStatus);
    const newTimeline = [
      ...order.timeline,
      { 
        status: newStatus, 
        text: statusInfo.text, 
        date: new Date().toLocaleString('vi-VN'),
        admin: 'Admin User'
      }
    ];
    
    setOrder({
      ...order,
      status: newStatus,
      timeline: newTimeline
    });
    
    alert(`Đã cập nhật trạng thái đơn hàng thành: ${statusInfo.text}`);
  };

  const addNote = () => {
    if (note.trim()) {
      const newTimeline = [
        ...order.timeline,
        { 
          status: 'note', 
          text: `Ghi chú: ${note}`,
          date: new Date().toLocaleString('vi-VN'),
          admin: 'Admin User'
        }
      ];
      
      setOrder({
        ...order,
        timeline: newTimeline
      });
      setNote('');
      alert('Đã thêm ghi chú vào đơn hàng');
    }
  };

  const statusInfo = getStatusText(order.status);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <Link to="/admin/orders" className="text-amber-600 hover:text-amber-700 mb-2 inline-block">
                ← Quay lại danh sách đơn hàng
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng #{order.id}</h1>
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
                  <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-amber-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{item.image}</span>
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
                  <span>{order.subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Phí vận chuyển:</span>
                  <span>{order.shippingFee.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
                  <span>Tổng cộng:</span>
                  <span className="text-amber-600">{order.total.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử đơn hàng</h2>
              <div className="space-y-4">
                {order.timeline.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === 'note' ? 'bg-gray-400' : 
                      index === order.timeline.length - 1 ? 'bg-amber-600' : 'bg-gray-300'
                    }`}>
                      <span className="text-white text-sm">
                        {step.status === 'note' ? '📝' : '✓'}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-gray-900">{step.text}</p>
                      <p className="text-sm text-gray-500">{step.date}</p>
                      {step.admin && (
                        <p className="text-xs text-gray-400">Bởi: {step.admin}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Note */}
              <div className="mt-6 border-t pt-4">
                <h3 className="text-md font-medium text-gray-900 mb-2">Thêm ghi chú</h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nhập ghi chú cho đơn hàng..."
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    onClick={addNote}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Customer Info & Actions */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin khách hàng</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Họ tên</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại</p>
                  <p className="font-medium">{order.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{order.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Địa chỉ giao hàng</p>
                  <p className="font-medium">{order.shippingAddress}</p>
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
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus('confirmed')}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ✓ Xác nhận đơn hàng
                  </button>
                )}
                {['pending', 'confirmed'].includes(order.status) && (
                  <button
                    onClick={() => updateOrderStatus('shipping')}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    🚚 Chuyển sang giao hàng
                  </button>
                )}
                {order.status === 'shipping' && (
                  <button
                    onClick={() => updateOrderStatus('completed')}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    ✅ Đánh dấu đã giao
                  </button>
                )}
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus('cancelled')}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    ❌ Hủy đơn hàng
                  </button>
                )}
                <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                  📧 Gửi email cho KH
                </button>
                <button className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors">
                  🖨️ In hóa đơn
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin đơn hàng</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày đặt:</span>
                  <span className="font-medium">{order.date}</span>
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
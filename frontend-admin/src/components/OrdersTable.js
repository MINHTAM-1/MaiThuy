import ROUTES from "../routes";

const OrdersTable = ({
  filteredOrders = [],
  navigate,
  updateOrderStatus,
  updatePaymentStatus,
  formatDate,
  formatCurrency,
  getStatusText,
  getPaymentStatusText,
}) => {
  return (
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
                Trạng thái đơn hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác đơn hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái thanh toán
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác thanh toán
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-500 text-lg">Không tìm thấy đơn hàng nào.</p>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const statusInfo = getStatusText(order.orderStatus);
                const statusPaymentInfo = getPaymentStatusText(order.paymentStatus);
                const orderId = order._id;
                const customerName = order.shippingAddress?.recipientName || 'Khách hàng';
                const phone = order.shippingAddress?.phone || '';
                const totalAmount = order.totalAmount || 0;

                return (
                  <tr
                    key={orderId}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`${ROUTES.ORDERS}/${orderId}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{orderId?.slice(-8).toUpperCase() || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">{order.paymentMethod || 'COD'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{customerName}</div>
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
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                      >
                        <span className="mr-1">{statusInfo.badge}</span>
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateOrderStatus(orderId, 'CONFIRMED');
                        }}
                        className="text-blue-600 hover:text-blue-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                        disabled={order.orderStatus !== 'PENDING'}
                      >
                        Xác nhận
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateOrderStatus(orderId, 'SHIPPING');
                        }}
                        className="text-purple-600 hover:text-purple-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                        disabled={!['PENDING', 'CONFIRMED'].includes(order.orderStatus)}
                      >
                        Giao hàng
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateOrderStatus(orderId, 'DELIVERED');
                        }}
                        className="text-green-600 hover:text-green-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                        disabled={order.orderStatus !== 'SHIPPING'}
                      >
                        Hoàn thành
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusPaymentInfo.color}`}
                      >
                        <span className="mr-1">{statusPaymentInfo.badge}</span>
                        {statusPaymentInfo.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updatePaymentStatus(orderId, 'PAID');
                        }}
                        className="text-purple-600 hover:text-purple-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                        disabled={!['PENDING'].includes(order.paymentStatus)}
                      >
                        Thanh toán
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
  );
};

export default OrdersTable;

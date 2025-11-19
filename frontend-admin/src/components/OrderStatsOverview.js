const OrderStatsOverview = ({ orders }) => {
  const getStats = () => {
    if (!Array.isArray(orders)) {
      return { total: 0, pending: 0, shipping: 0, completed: 0, revenue: 0 };
    }

    const total = orders.length;
    const pending = orders.filter(o => o.orderStatus === 'PENDING').length;
    const shipping = orders.filter(o => o.orderStatus === 'SHIPPING').length;
    const completed = orders.filter(o => o.orderStatus === 'DELIVERED').length;
    const revenue = orders.filter(o => o.orderStatus === 'DELIVERED')
      .reduce((sum, order) => sum + (order.totalPrice || order.totalAmount || 0), 0);

    return { total, pending, shipping, completed, revenue };
  };

  const stats = getStats();

  return (
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
  )
}
export default OrderStatsOverview;
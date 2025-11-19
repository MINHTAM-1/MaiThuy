const OrderTimeline = ({ order }) => {
  // Map các trạng thái với tên hiển thị và timestamp
  const timelineSteps = [
    { key: "paidTimestamp", label: "Đã thanh toán" },
    { key: "failedTimestamp", label: "Thanh toán thất bại" },
    { key: "confirmedTimestamp", label: "Đã xác nhận" },
    { key: "shippingTimestamp", label: "Đang giao hàng" },
    { key: "deliveredTimestamp", label: "Đã giao" },
    { key: "cancelledTimestamp", label: "Đã hủy" },
  ];

  // Lọc các bước có timestamp
  const stepsWithTimestamp = timelineSteps
    .filter(step => order[step.key])
    .map(step => ({
      ...step,
      date: new Date(order[step.key]).toLocaleString("vi-VN"),
    }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử đơn hàng</h2>
      <div className="space-y-4">
        {stepsWithTimestamp.map((step, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${step.key === "cancelledTimestamp" ? "bg-red-500" : "bg-amber-600"}`}
            >
              <span className="text-white text-sm">✓</span>
            </div>
            <div className="flex-grow">
              <p className="font-medium text-gray-900">{step.label}</p>
              <p className="text-sm text-gray-500">{step.date}</p>
              {/* Nếu có admin thì hiển thị */}
              {order.admin && (
                <p className="text-xs text-gray-400">Bởi: {order.admin}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default OrderTimeline;
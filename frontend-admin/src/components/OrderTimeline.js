const OrderTimeline = ({ order, payment }) => {
  // Map các trạng thái với tên hiển thị và timestamp
  const timelineSteps = [
    { key: "createdAt", label: "Đặt hàng", from: "order" },
    { key: "paidTimestamp", label: "Đã thanh toán", from: "payment" },
    { key: "failedTimestamp", label: "Thanh toán thất bại", from: "payment" },
    { key: "confirmedTimestamp", label: "Đã xác nhận", from: "order" },
    { key: "shippingTimestamp", label: "Đang giao hàng", from: "order" },
    { key: "deliveredTimestamp", label: "Đã giao", from: "order" },
    { key: "cancelledTimestamp", label: "Đã hủy", from: "order" },
    { key: "refundedTimestamp", label: "Đã hoàn tiền", from: "payment" },
  ];

  // Lọc các bước có timestamp
const stepsWithTimestamp = timelineSteps
  .map(step => {
    const source = step.from === "payment" ? payment : order;
    const dateValue = source?.[step.key];
    if (!dateValue) return null;
    return {
      ...step,
      date: new Date(dateValue),
    };
  })
  .filter(Boolean)
  // Sắp xếp theo thời gian tăng dần
  .sort((a, b) => a.date - b.date)
  .map(step => ({
    ...step,
    date: step.date.toLocaleString("vi-VN"),
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử đơn hàng</h2>
      <div className="space-y-4">
        {stepsWithTimestamp.map((step, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${step.key === "cancelledTimestamp" || step.key === "failedTimestamp"
                  ? "bg-red-500"
                  : "bg-amber-600"
                }`}
            >
              <span className="text-white text-sm">✓</span>
            </div>
            <div className="flex-grow">
              <p className="font-medium text-gray-900">{step.label}</p>
              <p className="text-sm text-gray-500">{step.date}</p>
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

const statusButtons = [
  { label: "Tất cả", value: "all", bgColor: "bg-amber-600", hoverColor: "hover:bg-gray-300" },
  { label: "Chờ xử lý", value: "PENDING", bgColor: "bg-yellow-600", hoverColor: "hover:bg-gray-300" },
  { label: "Đang giao", value: "SHIPPING", bgColor: "bg-purple-600", hoverColor: "hover:bg-gray-300" },
  { label: "Đã giao", value: "DELIVERED", bgColor: "bg-green-600", hoverColor: "hover:bg-gray-300" },
];

const OrderFilters = ({ filterStatus, setFilterStatus, searchTerm, setSearchTerm }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        {/* Status Buttons */}
        <div className="flex flex-wrap gap-2">
          {statusButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilterStatus(btn.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === btn.value
                  ? `${btn.bgColor} text-white`
                  : `bg-gray-200 text-gray-700 ${btn.hoverColor}`
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="lg:w-64">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn, tên KH..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;

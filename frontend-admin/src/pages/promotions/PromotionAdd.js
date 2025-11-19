import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { promotionsAPI } from "../../services/api";
import Loading from "../../components/Loading";
import ROUTES from "../../routes";

const PromotionAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [promotion, setPromotion] = useState({
    code: "",
    description: "",
    discountType: "percent",
    discountValue: "",
    minOrderValue: "",
    startDate: "",
    endDate: "",
    active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPromotion((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!promotion.code.trim()) {
      toast.error("Vui lòng nhập mã khuyến mãi");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        code: promotion.code.trim().toUpperCase(),
        description: promotion.description,
        discountType: promotion.discountType,
        discountValue: Number(promotion.discountValue),
        minOrderValue: Number(promotion.minOrderValue || 0),
        startDate: new Date(promotion.startDate),
        endDate: new Date(promotion.endDate),
        active: promotion.active,
      };

      const res = await promotionsAPI.create(payload);

      if (res.data?.success) {
        toast.success("Thêm khuyến mãi thành công!");
        navigate(ROUTES.PROMOTIONS);
      } else {
        toast.error(res.data?.message || "Không thể thêm khuyến mãi");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Thêm khuyến mãi thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Thêm khuyến mãi</h1>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="bg-white rounded-lg shadow p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Nhập thông tin khuyến mãi
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Code */}
            <div>
              <label className="block text-sm font-medium mb-2">Mã khuyến mãi</label>
              <input
                type="text"
                name="code"
                value={promotion.code}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Mô tả</label>
              <textarea
                rows="4"
                name="description"
                value={promotion.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            {/* Discount Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Kiểu giảm giá</label>
              <select
                name="discountType"
                value={promotion.discountType}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="percent">Phần trăm (%)</option>
                <option value="fixed">Số tiền cố định</option>
              </select>
            </div>

            {/* Discount Value */}
            <div>
              <label className="block text-sm font-medium mb-2">Giá trị giảm</label>
              <input
                type="number"
                name="discountValue"
                value={promotion.discountValue}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            {/* Min Order Value */}
            <div>
              <label className="block text-sm font-medium mb-2">Giá trị đơn tối thiểu</label>
              <input
                type="number"
                name="minOrderValue"
                value={promotion.minOrderValue}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2">Ngày bắt đầu</label>
                <input
                  type="date"
                  name="startDate"
                  value={promotion.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ngày kết thúc</label>
                <input
                  type="date"
                  name="endDate"
                  value={promotion.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Active */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="active"
                checked={promotion.active}
                onChange={handleChange}
              />
              <label>Kích hoạt</label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700"
            >
              Thêm khuyến mãi
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default PromotionAdd;

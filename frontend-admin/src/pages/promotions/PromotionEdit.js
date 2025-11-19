import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { promotionsAPI } from "../../services/api";
import Loading from "../../components/Loading";
import ROUTES from "../../routes";

const PromotionEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [promotion, setPromotion] = useState({
    code: "",
    description: "",
    discountType: "",
    discountValue: "",
    minOrderValue: "",
    startDate: "",
    endDate: "",
    active: true,
  });

  const [original, setOriginal] = useState({
    code: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await promotionsAPI.getById(id);

        if (res.data?.success) {
          const p = res.data.data;

          setPromotion({
            code: p.code,
            description: p.description,
            discountType: p.discountType,
            discountValue: p.discountValue,
            minOrderValue: p.minOrderValue,
            startDate: p.startDate?.slice(0, 10),
            endDate: p.endDate?.slice(0, 10),
            active: p.active,
          });

          setOriginal({ code: p.code });
        }
      } catch (err) {
        toast.error("Không tải được dữ liệu khuyến mãi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPromotion((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        description: promotion.description,
        discountType: promotion.discountType,
        discountValue: Number(promotion.discountValue),
        minOrderValue: Number(promotion.minOrderValue),
        startDate: new Date(promotion.startDate),
        endDate: new Date(promotion.endDate),
        active: promotion.active,
      };

      // chỉ gửi code nếu user sửa
      if (promotion.code !== original.code) {
        payload.code = promotion.code.trim().toUpperCase();
      }

      const res = await promotionsAPI.update(id, payload);

      if (res.data?.success) {
        toast.success("Cập nhật khuyến mãi thành công!");
        navigate(ROUTES.PROMOTIONS);
      } else {
        toast.error(res.data.message || "Cập nhật thất bại");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between">
          <h1 className="text-3xl font-bold">Sửa khuyến mãi</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 px-5 py-2 rounded-lg hover:bg-gray-400"
          >
            Quay lại
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <section className="bg-white rounded-lg shadow p-8">
          <h3 className="text-2xl font-bold mb-6">Chỉnh sửa thông tin khuyến mãi</h3>

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
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            {/* Discount Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Kiểu giảm giá</label>
              <select
                name="discountType"
                value={promotion.discountType}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg"
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
                className="w-full px-4 py-3 border rounded-lg"
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
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Ngày bắt đầu</label>
                <input
                  type="date"
                  name="startDate"
                  value={promotion.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg"
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

            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700"
            >
              Cập nhật khuyến mãi
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default PromotionEdit;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { typesAPI } from "../../services/api";
import Loading from "../../components/Loading";
import ROUTES from "../../routes";

const TypeAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState({
    name: "",
    description: "",
    slug: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setType((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!type.name.trim()) {
      toast.error("Vui lòng nhập tên nhóm sản phẩm");
      setLoading(false);
      return;
    }

    try {
      // payload chỉ gồm name + description
      const payload = {
        name: type.name,
        description: type.description,
      };

      // nếu người dùng nhập slug → mới đưa vào payload
      if (type.slug.trim() !== "") {
        payload.slug = type.slug;
      }

      const res = await typesAPI.create(payload);

      if (res.data?.success) {
        toast.success("Thêm nhóm sản phẩm thành công!");
        navigate(ROUTES.TYPES);
      } else {
        toast.error(res.data?.message || "Không thể thêm nhóm sản phẩm");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Thêm nhóm sản phẩm thất bại");
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
            <h1 className="text-3xl font-bold text-gray-900">Thêm nhóm sản phẩm</h1>
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
            Nhập thông tin nhóm sản phẩm
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Tên nhóm sản phẩm */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên nhóm sản phẩm
              </label>
              <input
                type="text"
                name="name"
                value={type.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>

            {/* Mô tả */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                rows="5"
                name="description"
                value={type.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-vertical"
              ></textarea>
            </div>

            {/* Slug - optional */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug (tùy chọn)</label>
              <input
                type="text"
                name="slug"
                value={type.slug}
                onChange={handleChange}
                placeholder="Để trống để tự tạo từ tên"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200 text-lg"
            >
              Thêm nhóm sản phẩm
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default TypeAdd;

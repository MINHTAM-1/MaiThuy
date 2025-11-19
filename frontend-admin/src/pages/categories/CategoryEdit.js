import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { categoriesAPI } from "../../services/api";
import Loading from "../../components/Loading";
import ROUTES from "../../routes";

const CategoryEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState({
    name: "",
    description: ""
  });
  const [original, setOriginal] = useState({
    slug: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await categoriesAPI.getById(id);
        if (res.data?.success) {
          const category = res.data.data;
          setCategory({
            name: category.name,
            description: category.description,
            slug: category.slug,
          });
          setOriginal({
            slug: category.slug,
          });
        }
      } catch (err) {
        console.error(err.response?.data?.message);
        toast.error(err.response?.data?.message || "Không tải được dữ liệu loại sản phẩm hoặc nhóm loại sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!category.name) {
      toast.error("Vui lòng nhập tên loại sản phẩm");
      return;
    }

    try {
      const payload = {
        name: category.name,
        description: category.description,
      };

      // chỉ thêm slug khi user sửa slug
      if (category.slug !== original.slug) {
        payload.slug = category.slug;
      }
      const res = await categoriesAPI.update(id, payload);

      if (res.data?.success) {
        toast.success("Cập nhật loại sản phẩm thành công!");
        navigate(ROUTES.CATEGORIES);
      } else {
        toast.error(res.data?.message || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error(err.response?.data?.message);
      toast.error(err.response?.data?.message || "Cập nhật thất bại");
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
            <h1 className="text-3xl font-bold text-gray-900">Sửa loại sản phẩm</h1>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="add-pro bg-white rounded-lg shadow p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Chỉnh sửa thông tin loại sản phẩm
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mã loại sản phẩm (readonly) */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã loại sản phẩm
              </label>
              <input
                type="text"
                name="id"
                value={id}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
              />
            </div>

            {/* Tên loại sản phẩm */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên loại sản phẩm
              </label>
              <input
                type="text"
                name="name"
                value={category.name}
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
                value={category.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-vertical"
              ></textarea>
            </div>

            {/* Slug */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug (tùy chọn)</label>
              <input
                type="text"
                name="slug"
                value={category.slug}
                onChange={handleChange}
                placeholder="50"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200 text-lg"
            >
              Cập nhật loại sản phẩm
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default CategoryEdit;

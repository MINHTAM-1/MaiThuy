import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { productsAPI, categoriesAPI } from "../../services/api";
import Loading from "../../components/Loading";
import ROUTES from "../../routes";

const ProductEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    type: "",
    price: "",
    discount: "",
    stock: "",
    weight: "",
    origin: "",
    description: "",
    images: [],
    files: [],  // ảnh mới upload
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const resCategory = await categoriesAPI.getAll();
        if (resCategory.data?.success) {
          setCategories(resCategory.data.data.items);
        }

        if (id) {
          const resProduct = await productsAPI.getById(id);
          if (resProduct.data?.success) {
            const product = resProduct.data.data;
            setFormData({
              categoryId: product.categoryId._id,
              name: product.name,
              type: product.type,
              price: product.price,
              discount: product.discount,
              stock: product.stock,
              origin: product.origin,
              weight: product.weight,
              description: product.description,
              images: product.images || [],
              files: [], // new uploads
            });
          }
        }
      } catch (err) {
        console.error(err.response?.data?.message);
        toast.error(err.response?.data?.message || "Không tải được dữ liệu sản phẩm hoặc nhóm sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "files") {
      setFormData((prev) => ({ ...prev, files: Array.from(files) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.name || !formData.price) {
      toast.error("Vui lòng điền đầy đủ thông tin sản phẩm");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("categoryId", formData.categoryId);
      payload.append("type", formData.type);
      payload.append("price", formData.price);
      payload.append("discount", formData.discount || 0);
      payload.append("stock", formData.stock || 0);
      payload.append("origin", formData.origin);
      payload.append("weight", formData.weight);
      payload.append("description", formData.description);

      // gửi ảnh cũ còn lại
      formData.images.forEach((url) => payload.append("images", url));

      // gửi ảnh mới upload
      formData.files.forEach((file) => payload.append("files", file));

      const res = await productsAPI.update(id, payload);

      if (res.data?.success) {
        toast.success("Cập nhật sản phẩm thành công!");
        navigate(ROUTES.PRODUCTS);
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
            <h1 className="text-3xl font-bold text-gray-900">Sửa sản phẩm</h1>
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
            Chỉnh sửa thông tin sản phẩm
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mã sản phẩm (readonly) */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã sản phẩm
              </label>
              <input
                type="text"
                name="masp"
                value={id}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
              />
            </div>

            {/* Nhóm sản phẩm
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhóm sản phẩm
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                {types.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div> */}

            {/* Loại sản phẩm */}
            <div className="select-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại sản phẩm
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhóm sản phẩm
              </label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>

            {/* Tên sản phẩm */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên sản phẩm
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>

            {/* Giá sản phẩm */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá sản phẩm
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>

            {/* Giảm giá */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giảm giá (Phần trăm)
              </label>
              <input
                type="text"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="10"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Xuất xứ */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xuất xứ
              </label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Khối lượng */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khối lượng
              </label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Tồn kho */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tồn kho</label>
              <input
                type="text"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="50"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-vertical"
              ></textarea>
            </div>

            {/* Hình ảnh */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh
              </label>
              <input
                type="file"
                name="files"
                multiple
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm 
                file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.images.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img src={url} alt={`img-${idx}`} className="w-48 h-56 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-0 right-0 w-6 h-6 
                      bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200 text-lg"
            >
              Cập nhật sản phẩm
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default ProductEdit;

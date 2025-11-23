import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { categoriesAPI, productsAPI, typesAPI } from "../../services/api";
import Loading from "../../components/Loading";
import ROUTES from "../../routes";

const ProductAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  const [formData, setFormData] = useState({
    typeId: "",
    categoryId: "",
    name: "",
    price: "",
    discount: 0,
    stock: 0,
    origin: "Việt Nam",
    weight: "",
    description: "",
    files: null,          // Ảnh mới upload
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await categoriesAPI.getAll();
        const resType = await typesAPI.getAll();

        let categoriesData = [];
        let typesData = [];

        if (res.data?.success) {
          categoriesData = res.data.data.items;
          setCategories(categoriesData);
        }

        if (resType.data?.success) {
          typesData = resType.data.data.items;
          setTypes(typesData);
        }

        // 🌟 Set default categoryId + typeId
        setFormData(prev => ({
          ...prev,
          categoryId: categoriesData[0]?._id || "",
          typeId: typesData[0]?._id || ""
        }));

      } catch (err) {
        console.error(err.response?.data?.message);
        toast.error("Không tải được danh mục sản phẩm hoặc nhóm sản phẩm!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "files") {
      setFormData(prev => ({ ...prev, files: Array.from(files) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId) {
      toast.error("Vui lòng điền đầy đủ thông tin sản phẩm");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("categoryId", formData.categoryId);
      payload.append("typeId", formData.typeId);
      payload.append("price", formData.price);
      payload.append("discount", formData.discount);
      payload.append("stock", formData.stock);
      payload.append("origin", formData.origin);
      payload.append("weight", formData.weight);
      payload.append("description", formData.description);

      if (formData.files) {
        formData.files.forEach((file) => payload.append("files", file));
      }

      setLoading(true);
      const res = await productsAPI.create(payload);
      console.log("res: ", res);
      if (res.data?.success) {
        toast.success("Thêm sản phẩm thành công!");
        navigate(ROUTES.PRODUCTS);
      } else {
        toast.error(res.data?.message || "Thêm thất bại");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Thêm thất bại");
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
            <h1 className="text-3xl font-bold text-gray-900">Thêm sản phẩm mới</h1>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Thông tin sản phẩm</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Loại sản phẩm */}
            <div className="select-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">Loại sản phẩm</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Nhóm sản phẩm */}
            <div className="select-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nhóm sản phẩm</label>
              <select
                name="typeId"
                value={formData.typeId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                {types.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tên sản phẩm */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="MAITHUY1: Arabica Mật Ong"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>

            {/* Giá sản phẩm */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">Giá sản phẩm</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="100.000 (VNĐ)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Xuất xứ</label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="Việt Nam"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Khối lượng */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">Khối lượng</label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="500g"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
              <textarea
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Miêu tả sản phẩm,..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-vertical"
              ></textarea>
            </div>

            {/* Hình ảnh */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh</label>
              <input
                type="file"
                name="files"
                multiple
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200 text-lg"
            >
              Thêm sản phẩm
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default ProductAdd;
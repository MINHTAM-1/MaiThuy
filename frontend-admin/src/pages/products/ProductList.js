import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { productsAPI } from "../../services/api";
import { useDebounce } from "use-debounce";
import confirmToast from "../../components/ConfirmToast";
import ROUTES from "../../routes";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 600);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);

  // LOAD PRODUCTS

  const fetchProducts = useCallback(async (resetPage = false) => {
    try {
      setLoading(true);
      setError("");

      const res = await productsAPI.getAll({
        q: debouncedSearch || undefined,
        page: resetPage ? 0 : page,
      });

      if (res.data?.success) {
        const data = res.data.data;
        setProducts(data.items || []);
        setTotalPages(data.totalPages || 1);
      } else {
        setProducts([]);
        setError("Không tìm thấy sản phẩm");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset page khi search
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    const confirmed = await confirmToast({ textConfirm: "Bạn có chắc muốn xóa sản phẩm này?" });
    if (!confirmed) return;

    try {
      await productsAPI.delete(id);
      toast.success("Xóa thành công!");

      // Reload
      fetchProducts(true);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xóa sản phẩm");
      setError(err.response?.data?.message || "Lỗi khi xóa sản phẩm")
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const getStatusBadge = (product) => {
    const isActive = product.active !== false;
    const inStock = (product.stock || 0) > 0;

    if (!isActive) {
      return { text: 'Ẩn', color: 'bg-gray-100 text-gray-800' };
    }
    if (!inStock) {
      return { text: 'Hết hàng', color: 'bg-red-100 text-red-800' };
    }
    if (product.featured) {
      return { text: 'Nổi bật', color: 'bg-amber-100 text-amber-800' };
    }
    return { text: 'Đang bán', color: 'bg-green-100 text-green-800' };
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchProducts(true)}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Sản phẩm</h1>
            <p className="text-gray-600 mt-2">Quản lý danh sách sản phẩm trong cửa hàng</p>
          </div>
          <Link
            to={ROUTES.ADD_PRODUCT}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors flex items-center"
          >
            <span className="mr-2">➕</span>
            Thêm sản phẩm
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã hoặc mô tả..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />

        <button
          type="button"
          onClick={() => fetchProducts(true)}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          🔄 Làm mới
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {!Array.isArray(products) || products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📦</div>
            <p className="text-gray-500 text-lg mb-4">Không có sản phẩm nào</p>
            <Link
              to={ROUTES.ADD_PRODUCT}
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors inline-flex items-center"
            >
              <span className="mr-2">➕</span>
              Thêm sản phẩm đầu tiên
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tồn kho
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => {
                    const status = getStatusBadge(product);
                    return (
                      <tr key={product._id || product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {product.images?.[0] ? (
                                <img
                                  className="h-10 w-10 rounded-lg object-cover"
                                  src={product.images[0]}
                                  alt={product.name}
                                />
                              ) : (
                                <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                  <span className="text-amber-600">☕</span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name || product.ten_sp}
                              </div>
                              <div className="text-sm text-gray-500">
                                {product.category || 'Chưa phân loại'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCurrency(product.price)}
                          </div>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="text-sm text-gray-500 line-through">
                              {formatCurrency(product.originalPrice)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {product.stock || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                            {status.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              to={`${ROUTES.PRODUCTS}/${product._id}`}
                              className="text-amber-600 hover:text-amber-900"
                            >
                              ✏️ Sửa
                            </Link>
                            <button
                              onClick={() => handleDelete(product._id || product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              🗑️ Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;
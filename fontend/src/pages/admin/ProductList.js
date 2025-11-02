import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Sử dụng useCallback để memoize fetchProducts
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Fetching products...');
      const response = await productsAPI.getAll({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined
      });

      console.log('📦 Products API Response:', response.data);

      // Xử lý response data
      if (response.data && response.data.success) {
        const productsData = response.data.data || response.data.products || response.data;
        
        // Đảm bảo products là array
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else if (productsData && Array.isArray(productsData.data)) {
          setProducts(productsData.data);
        } else if (productsData && Array.isArray(productsData.products)) {
          setProducts(productsData.products);
        } else {
          console.warn('⚠️ Products data is not an array:', productsData);
          setProducts([]);
        }

        // Xử lý pagination
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages || 1);
        } else if (response.data.totalPages) {
          setTotalPages(response.data.totalPages);
        }
      } else {
        console.warn('⚠️ No products data in response');
        setProducts([]);
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setError('Không thể tải danh sách sản phẩm');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]); // Thêm dependencies

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Chỉ cần fetchProducts trong dependencies

  const handleDelete = async (productId) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      await productsAPI.delete(productId);
      alert('Xóa sản phẩm thành công!');
      fetchProducts(); // Refresh list
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Lỗi khi xóa sản phẩm');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    // Không cần gọi fetchProducts() vì useEffect sẽ tự động chạy khi currentPage thay đổi
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setCurrentPage(1);
    // Không cần gọi fetchProducts() vì useEffect sẽ tự động chạy
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
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
            to="/admin/products/add"
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors flex items-center"
          >
            <span className="mr-2">➕</span>
            Thêm sản phẩm
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button
            type="submit"
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            🔍 Tìm kiếm
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            🔄 Làm mới
          </button>
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {!Array.isArray(products) || products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📦</div>
            <p className="text-gray-500 text-lg mb-4">Không có sản phẩm nào</p>
            <Link
              to="/admin/products/add"
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
                              to={`/admin/products/edit/${product._id || product.id}`}
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
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-700">
                    Trang <span className="font-medium">{currentPage}</span> của{' '}
                    <span className="font-medium">{totalPages}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Trước
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;
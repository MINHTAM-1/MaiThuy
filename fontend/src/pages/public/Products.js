import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { categoryAPI, productsAPI } from '../../services/api';
import ProductGrid from '../../components/products/ProductGrid';
import toast from 'react-hot-toast';
import { useDebounce } from 'use-debounce';
import Loading from '../../components/layout/Loading';

const Products = () => {
  const { id: categorySlugFromURL } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromURL = searchParams.get('q') || '';
  const categorySlugFromQuery = searchParams.get('category') || '';
  const [searchTerm, setSearchTerm] = useState(queryFromURL);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 800);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // PHÂN TRANG
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // LOAD CATEGORIES
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryAPI.getAll();
        const items = res.data.data?.items || [];
        setCategories(items);

        const slug = categorySlugFromQuery || categorySlugFromURL;
        if (slug) {
          const cat = items.find(c => c.slug === slug);
          setSelectedCategory(cat || null);
        }
      } catch (err) {
        console.error(err);
        toast.error("Lỗi khi tải danh mục");
      }
    };
    loadCategories();
  }, [categorySlugFromURL, categorySlugFromQuery]);

  // LOAD PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = {
          q: debouncedSearchTerm || undefined,
          page,
        };

        let res;
        if (selectedCategory) {
          res = await productsAPI.getByCategoryId(selectedCategory._id, params);
        } else {
          res = await productsAPI.getAll(params);
        }

        const data = res.data.data;
        setProducts(data?.items || []);
        setTotalPages(data?.totalPages || 1);
      } catch (err) {
        console.error(err);
        toast.error("Lỗi khi tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, debouncedSearchTerm, page]);

  // Reset page = 0 khi search hoặc đổi category
  useEffect(() => {
    setPage(0);
  }, [debouncedSearchTerm, selectedCategory]);

  // Update URL params
  const updateParams = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateParams('q', value);
  };
  const clearSearch = () => {
    setSearchTerm('');
    updateParams('q', '');
  };

  // Category Change
  const handleCategoryChange = (category) => {
    if (category === 'all') {
      setSelectedCategory(null);
      updateParams('category', '');
      return;
    }
    setSelectedCategory(category);
    updateParams('category', category.slug);
  };

  if (loading) return (
    <Loading />
  );

  return (
    <section id="product-page" className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sản Phẩm Cà Phê</h1>
          <p className="text-xl text-gray-600">Khám phá các loại cà phê từ MAITHUY</p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 pl-10 pr-12 border rounded-lg"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</div>
            {searchTerm && (
              <button onClick={clearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">✕</button>
            )}
          </div>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <ul className="flex flex-wrap gap-4 justify-center">
            <li>
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-6 py-3 rounded-full ${!selectedCategory ? 'bg-amber-600 text-white' : 'bg-white border'}`}
              >
                Tất cả
              </button>
            </li>
            {categories.map(cat => (
              <li key={cat._id}>
                <button
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-6 py-3 rounded-full ${selectedCategory?._id === cat._id ? 'bg-amber-600 text-white' : 'bg-white border'}`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Search Results Info */}
        {(searchTerm || selectedCategory) && (
          <div className="text-center mb-6">
            <p className="text-gray-600">
              Tìm thấy{" "}
              <span className="font-semibold">{products.length}</span>{" "}
              sản phẩm
              {searchTerm && ` cho từ khóa "${searchTerm}"`}
              {selectedCategory &&
                selectedCategory !== "all" &&
                ` trong danh mục "${selectedCategory.name}"`}
            </p>
          </div>
        )}

        {/* Product Grid */}
        <ProductGrid products={products}/>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            disabled={page === 0}
            onClick={() => setPage(prev => Math.max(prev - 1, 0))}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Trước
          </button>

          <span>Trang {page + 1} / {totalPages}</span>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>
    </section>
  );
};

export default Products;

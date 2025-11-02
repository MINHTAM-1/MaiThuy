import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../../services/api';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      try {
        const response = await productsAPI.search(searchTerm, { limit: 5 });
        if (response.data) {
          setSuggestions(response.data.products || response.data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Lỗi khi tìm kiếm gợi ý:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/products/${product._id || product.id}`);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <form 
      ref={searchRef}
      onSubmit={handleSubmit} 
      className="flex-1 max-w-lg mx-4 relative"
    >
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
          className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400">🔍</span>
        </div>
        <button
          type="submit"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <span className="text-amber-600 hover:text-amber-700 font-medium">Tìm</span>
        </button>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600 mx-auto"></div>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((product) => (
                <button
                  key={product._id || product.id}
                  type="button"
                  onClick={() => handleSuggestionClick(product)}
                  className="w-full text-left px-4 py-2 hover:bg-amber-50 transition-colors flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center">
                    <span className="text-sm">☕</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {product.ten_sp || product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(product.gia_sp || product.price)?.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </button>
              ))}
              <div className="border-t border-gray-200 mt-2 pt-2">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full text-left px-4 py-2 text-amber-600 hover:bg-amber-50 font-medium"
                >
                  Xem tất cả kết quả cho "{searchTerm}"
                </button>
              </div>
            </div>
          ) : searchTerm.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              Không tìm thấy sản phẩm phù hợp
            </div>
          ) : null}
        </div>
      )}
    </form>
  );
};

export default SearchBar;
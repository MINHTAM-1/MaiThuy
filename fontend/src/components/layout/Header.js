import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import SearchBar from "../search/SearchBar";
import CartButton from "../cart/CartButton";
import WishlistButton from '../wishlist/WishlistButton';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
      isActive(path)
        ? "text-amber-800 bg-amber-50"
        : "text-gray-700 hover:text-amber-800 hover:bg-amber-50"
    }`;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-3xl">☕</span>
            <span className="text-2xl font-bold text-amber-900 hidden sm:block">
              MAITHUY Coffee
            </span>
          </Link>

          {/* Search Bar - Hiển thị trên desktop */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          {/* Navigation và User Actions */}
          <div className="flex items-center space-x-4">
            {/* Navigation - Ẩn trên mobile khi có search */}
            <nav className="hidden md:flex items-center space-x-2">
              <Link to="/" className={navLinkClass("/")}>
                Trang Chủ
              </Link>
              <Link to="/about" className={navLinkClass("/about")}>
                Giới Thiệu
              </Link>
              <Link to="/products" className={navLinkClass("/products")}>
                Sản Phẩm
              </Link>
              <Link to="/contact" className={navLinkClass("/contact")}>
                Liên Hệ
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className={navLinkClass("/admin")}>
                  Admin
                </Link>
              )}
            </nav>

            {/* Wishlist Button */}
            <WishlistButton />

            {/* Cart Button */}
            <CartButton />

            {/* User Profile Dropdown hoặc Login Button */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-2 text-gray-700 hover:text-amber-800 transition-colors">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border">
                  <div className="py-2">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b">
                      Xin chào, <strong>{user?.name}</strong>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-700"
                    >
                      👤 Tài khoản của tôi
                    </Link>
                    <Link
                      to="/wishlist"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-700"
                    >
                      <span className="mr-2">❤️</span>
                      Danh sách yêu thích
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-700"
                    >
                      🛒 Đơn hàng
                    </Link>
                    <hr className="my-1" />
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-700"
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-amber-800 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar Mobile - Hiển thị dưới trên mobile */}
        <div className="md:hidden pb-4">
          <SearchBar />
        </div>
      </div>
    </header>
  );
};

export default Header;
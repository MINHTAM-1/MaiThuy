import { Link, useLocation } from 'react-router-dom';
import CartButton from './CartButton';

const Navbar = () => {
  const location = useLocation();

  const navLinkClass = (path) => 
    `px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
      location.pathname === path
        ? 'text-amber-800 bg-amber-50'
        : 'text-gray-700 hover:text-amber-800 hover:bg-amber-50'
    }`;

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
            <span className="text-3xl">☕</span>
            <span className="text-amber-900">MaiThuyCoffee</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/" className={navLinkClass('/')}>
              Trang Chủ
            </Link>
            <Link to="/menu" className={navLinkClass('/menu')}>
              Thực Đơn
            </Link>
            <Link to="/about" className={navLinkClass('/about')}>
              Về Chúng Tôi
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <CartButton />
            <Link 
              to="/profile" 
              className={navLinkClass('/profile')}
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                  <span className="text-amber-800 text-sm font-semibold">U</span>
                </div>
                <span className="hidden sm:block">Tài khoản</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
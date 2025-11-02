import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Quản lý Sản phẩm', icon: '🛍️' },
    { path: '/admin/orders', label: 'Quản lý Đơn hàng', icon: '📦' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-amber-800 text-white shadow-lg flex flex-col">
        <div className="p-4 flex-1">
          <Link to="/admin/dashboard" className="flex items-center space-x-2 mb-8">
            <span className="text-2xl">☕</span>
            <span className="text-xl font-bold">MAITHUY Admin</span>
          </Link>
          
          <nav className="space-y-2">
            {adminMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-amber-900 text-white'
                    : 'text-amber-100 hover:bg-amber-700'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        {/* User Info & Logout */}
        <div className="p-4 border-t border-amber-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || 'Admin'}
              </p>
              <p className="text-xs text-amber-200 truncate">
                {user?.email || 'admin@maithuy.com'}
              </p>
              <p className="text-xs text-amber-300 font-semibold">
                {user?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-amber-700 hover:bg-amber-600 text-white py-2 px-4 rounded-lg text-sm transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
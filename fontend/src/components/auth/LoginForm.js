import { useState } from 'react';
import { Link } from 'react-router-dom';
import SocialLogin from './SocialLogin';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng nhập ở đây
    console.log('Login data:', formData);
    alert('Đăng nhập thành công!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập tài khoản</p>
      
      <SocialLogin />

      <div className="space-y-4">
        <div className="text-fields email relative">
          <label htmlFor="email" className="sr-only">Email</label>
          <div className="relative">
            <i className='bx bx-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl'></i>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email của bạn"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
        </div>

        <div className="text-fields password relative">
          <label htmlFor="password" className="sr-only">Mật khẩu</label>
          <div className="relative">
            <i className='bx bx-lock-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl'></i>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
        </div>

        <div className="login-function-buttons flex justify-between items-center">
          <div className="login-rememberMe-checkbox flex items-center space-x-2">
            <input
              type="checkbox"
              name="rememberMe"
              id="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-600">Lưu tên đăng nhập</label>
          </div>

          <Link to="#" className="text-sm text-amber-600 hover:text-amber-700">
            Quên mật khẩu ?
          </Link>
        </div>

        <button
          type="submit"
          name="sign-in-btn"
          className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200"
        >
          Đăng nhập
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

 // Trong handleSubmit function của Login component
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Lưu remember me preference
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      // Hiển thị thông báo thành công
      alert('Đăng nhập thành công!');

      console.log('✅ Login successful, redirecting...');
      
      // QUAN TRỌNG: Redirect sau khi login thành công
      const from = location.state?.from?.pathname || (result.user?.role === 'admin' ? '/admin/dashboard' : '/');
      navigate(from, { replace: true });
      
    } else {
      setError(result.message);
    }
  } catch (err) {
    setError('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
    console.error('Login error:', err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url(/assets/bg-login.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Welcome */}
          <div className="bg-amber-900 text-white p-12 flex flex-col justify-center">
            <div className="logo mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">☕</span>
                <span className="text-2xl font-bold">MAITHUY Coffee</span>
              </div>
            </div>

            <p className="text-2xl font-bold mb-4">Tạo tài khoản</p>
            <p className="text-amber-100 mb-8">
              Để trải nghiệm dịch vụ mua sắm nhanh chóng và tiện lợi ngay hôm
              nay !
            </p>
            <Link
              to="/register"
              className="bg-white text-amber-800 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors duration-200 text-center"
            >
              Đăng kí ngay
            </Link>
          </div>

          {/* Right Side - Login Form */}
          <div className="p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-3xl font-bold text-gray-900 mb-2">
                Đăng nhập tài khoản
              </p>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="text-fields email relative">
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                      📧
                    </span>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email của bạn"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="text-fields password relative">
                  <label htmlFor="password" className="sr-only">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                      🔒
                    </span>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      required
                      disabled={loading}
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
                      disabled={loading}
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-sm text-gray-600"
                    >
                      Lưu tên đăng nhập
                    </label>
                  </div>

                  <Link
                    to="#"
                    className="text-sm text-amber-600 hover:text-amber-700"
                  >
                    Quên mật khẩu ?
                  </Link>
                </div>

                <button
                  type="submit"
                  name="sign-in-btn"
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-amber-600 text-white hover:bg-amber-700"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Đang đăng nhập...
                    </div>
                  ) : (
                    "Đăng nhập"
                  )}
                </button>

                {/* Demo Accounts Info */}
                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800 font-semibold mb-2">
                    Tài khoản demo:
                  </p>
                  <div className="text-xs text-amber-700 space-y-1">
                    <p>👑 Admin: admin@maithuy.com / 123456</p>
                    <p>👤 User: customer1@maithuy.com / 123456</p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

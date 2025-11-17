import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ROUTES from "../../routes";
import { authAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";


const LoginForm = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setToken } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      const token = response.data.data.token;
      if (!token) {
        setError("Dữ liệu trả về không hợp lệ.");
        return;
      }

      // Lưu token
      localStorage.setItem("token", token);
      // Cập nhật token vào context
      setToken(token);

      // Remember me
      if (formData.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      navigate(ROUTES.HOME);
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <p className="text-3xl font-bold text-gray-900 mb-2">
        Đăng nhập tài khoản
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Email */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">📧</span>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email của bạn"
          required
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
          disabled={loading}
        />
      </div>

      {/* Password */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔒</span>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Nhập mật khẩu"
          required
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
          disabled={loading}
        />
      </div>

      {/* Remember me */}
      <div className="flex justify-between items-center">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            disabled={loading}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-600">Lưu tên đăng nhập</span>
        </label>

        <Link to={ROUTES.FORGOTPASSWORD} className="text-sm text-amber-600 hover:text-amber-700">
          Quên mật khẩu?
        </Link>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold 
          ${loading ? "bg-gray-400" : "bg-amber-600 hover:bg-amber-700 text-white"}
        `}
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>

      {/* Demo accounts */}
      <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <p className="text-sm font-semibold text-amber-800 mb-1">Tài khoản demo:</p>
        <p className="text-xs text-amber-700">Admin: admin@maithuy.com / 123456</p>
        <p className="text-xs text-amber-700">User: customer1@maithuy.com / 123456</p>
      </div>

    </form>
  );
};

export default LoginForm;

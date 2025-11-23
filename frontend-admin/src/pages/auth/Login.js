import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { authAPI } from "../../services/api";
import ROUTES from "../../routes";


const Login = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authAPI.login({ email, password });

      if (res.data.success) {
        const token = res.data.data.token;
        if (!token) {
          setError("Dữ liệu trả về không hợp lệ.");
          return;
        }

        // Lưu token
        localStorage.setItem("token", token);
        // Cập nhật token vào context
        setToken(token);

        navigate(ROUTES.HOME); // chuyển vào trang admin
      } else {
        setError("Email hoặc mật khẩu không đúng!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại.");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* Left */}
          <div className="bg-gray-900 text-white p-10 flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
            <p className="text-gray-300 mb-8">Đăng nhập để quản lý hệ thống.</p>

            <Link
              to={ROUTES.HOME}
              className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 w-max"
            >
              Về trang chủ
            </Link>
          </div>

          {/* Right */}
          <div className="p-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Đăng nhập</h2>

            {error && (
              <div className="mb-4 text-red-600 font-medium">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring focus:ring-gray-300"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring focus:ring-gray-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </button>

              <p className="text-right text-sm">
                <Link
                  to={ROUTES.FORGOTPASSWORD}
                  className="text-gray-600 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </p>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;

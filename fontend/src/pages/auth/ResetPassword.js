import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ROUTES from "../../routes";
import { useState } from "react";
import { authAPI } from "../../services/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const resetToken = localStorage.getItem("resetToken");

if (!resetToken) {
  return (
    <div className="text-center mt-20 text-red-600 text-xl">
      Token không hợp lệ hoặc đã hết hạn. Vui lòng thực hiện lại bước quên mật khẩu.
    </div>
  );
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.resetPassword({ resetToken, newPassword: password });
      
      console.log("res reset:" , response)
      if (response.data.success) {
        setMessage("Đặt lại mật khẩu thành công. Bạn có thể đăng nhập.");
        localStorage.removeItem("resetToken");
        navigate(ROUTES.LOGIN);
      } else {
        setError(response.data.message || "Đặt lại mật khẩu thất bại.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover"
         style={{ backgroundImage: "url(/assets/bg-login.jpg)" }}>
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* Left side */}
          <div className="bg-amber-900 text-white p-12 flex flex-col justify-center">
            <div className="flex items-center space-x-3 mb-8">
              <span className="text-3xl">☕</span>
              <span className="text-2xl font-bold">MAITHUY Coffee</span>
            </div>
            <p className="text-2xl font-bold mb-4">Đặt lại mật khẩu</p>
            <p className="text-amber-100 mb-8">
              Nhập mật khẩu mới để đăng nhập lại.
            </p>
            <Link
              to={ROUTES.LOGIN}
              className="bg-white text-amber-800 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50"
            >
              Quay lại đăng nhập
            </Link>
          </div>

          {/* Right side - Form */}
          <div className="p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {message && <p className="text-green-600">{message}</p>}
              {error && <p className="text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold 
                  ${loading ? "bg-gray-400" : "bg-amber-600 hover:bg-amber-700 text-white"}`}
              >
                {loading ? "Đang lưu..." : "Đặt lại mật khẩu"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

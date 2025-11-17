import { Link, useNavigate } from "react-router-dom";
import ROUTES from "../../routes";
import { useState } from "react";
import { authAPI } from "../../services/api";

const ValidateOTP = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const email = localStorage.getItem("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await authAPI.validateResetCode({ email, code });
      console.log('res: ', response.data.data)
      if (response.data.data?.resetToken) {
        setMessage("OTP hợp lệ! Bạn có thể đặt lại mật khẩu.");
        localStorage.setItem("resetToken", response.data.data.resetToken);
        navigate(ROUTES.RESETPASSWORD);
      } else {
        setError(response.data?.message || "OTP không hợp lệ.");
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
            <p className="text-2xl font-bold mb-4">Nhập OTP</p>
            <p className="text-amber-100 mb-8">
              Nhập OTP bạn vừa nhận được để đặt lại mật khẩu.
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
                <label className="block text-gray-700 mb-1">OTP</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Nhập mã OTP"
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
                {loading ? "Đang kiểm tra..." : "Xác nhận OTP"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ValidateOTP;

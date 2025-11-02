import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import RegisterForm from "../../components/auth/RegisterForm";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (formData) => {
    setLoading(true);
    setError("");

    try {
      const result = await register(formData);

      if (result.success) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        setError(result.message || "Có lỗi xảy ra khi đăng ký");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.");
      console.error("Register error:", err);
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

            <p className="text-2xl font-bold mb-4">Chào mừng trở lại!</p>
            <p className="text-amber-100 mb-8">
              Đăng nhập để tiếp tục trải nghiệm dịch vụ mua sắm nhanh chóng và tiện lợi!
            </p>
            <Link
              to="/login"
              className="bg-white text-amber-800 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors duration-200 text-center"
            >
              Đăng nhập ngay
            </Link>
          </div>

          {/* Right Side - Register Form */}
          <div className="p-12">
            <RegisterForm 
              onSubmit={handleRegister}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
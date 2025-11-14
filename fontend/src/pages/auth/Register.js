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
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-6xl h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full min-h-[80vh]">
          {/* Left Side - Welcome */}
          <div className="bg-amber-900 text-white p-12 flex flex-col justify-center">
            <div className="logo mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl font-bold">MAITHUY COFFEE</span>
              </div>
            </div>

            <p className="text-2xl font-bold mb-4">Chào mừng bạn đến với chúng tôi!</p>
            <p className="text-amber-100 mb-8">
              Đăng nhập để tiếp tục trải nghiệm dịch vụ mua sắm nhanh chóng và tiện lợi!
            </p>
            <Link
              to="/login"
              className="bg-white text-amber-800 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors duration-200 text-center flex items-center justify-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Đăng nhập ngay</span>
            </Link>
          </div>

          {/* Right Side - Register Form */}
          <div className="p-12 flex flex-col justify-center">
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
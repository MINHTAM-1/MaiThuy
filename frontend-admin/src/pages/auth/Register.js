import { Link } from "react-router-dom";
import RegisterForm from "../../components/auth/RegisterForm";

const Register = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/assets/bg-login.jpg)" }}
    >
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* LEFT */}
          <div className="bg-amber-900 text-white p-12 flex flex-col justify-center">
            <div className="flex items-center space-x-3 mb-8">
              <span className="text-3xl">☕</span>
              <span className="text-2xl font-bold">MAITHUY Coffee</span>
            </div>

            <p className="text-2xl font-bold mb-4">Chào mừng trở lại!</p>
            <p className="text-amber-100 mb-8">
              Đăng nhập để trải nghiệm mua sắm nhanh chóng và tiện lợi.
            </p>

            <Link
              to="/login"
              className="bg-white text-amber-800 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 text-center"
            >
              Đăng nhập ngay
            </Link>
          </div>

          {/* RIGHT — Register Form */}
          <div className="p-12">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

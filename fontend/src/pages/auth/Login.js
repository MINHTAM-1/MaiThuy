import { Link } from "react-router-dom";
import ROUTES from "../../routes";
import LoginForm from "../../components/auth/LoginForm";

const Login = () => {
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

            <p className="text-2xl font-bold mb-4">Tạo tài khoản</p>
            <p className="text-amber-100 mb-8">
              Mua sắm nhanh chóng và tiện lợi!
            </p>

            <Link
              to={ROUTES.REGISTER}
              className="bg-white text-amber-800 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50"
            >
              Đăng ký ngay
            </Link>
          </div>

          {/* Right side - Login Form */}
          <div className="p-12">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

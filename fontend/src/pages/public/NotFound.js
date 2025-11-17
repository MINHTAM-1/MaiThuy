import { useNavigate } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi"; 
import ROUTES from "../../routes";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center text-center px-4 bg-gray-50">
      <FiAlertCircle className="text-gray-400 mb-4" size={80} />
      <h1 className="text-6xl font-bold mb-2">404</h1>
      <p className="text-lg mb-6 text-gray-600">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại!
      </p>
      <button
        onClick={() => navigate(ROUTES.HOME)}
        className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
      >
        Quay về trang chủ
      </button>
    </div>
  );
};

export default NotFoundPage;

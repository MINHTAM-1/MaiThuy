import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ordersAPI } from "../../services/api";
import ROUTES from "../../routes";
import { FaCheck } from "react-icons/fa";

const OrderReturn = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await ordersAPI.getById(id);
        setOrder(data.data.data.order);
      } catch (err) {
        toast.error(err.response?.data?.message || "Có lỗi xảy ra khi tải đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-32">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center my-32">
        <div className="bg-white w-11/12 md:w-4/5 py-24 md:py-32 rounded-2xl text-center shadow-md">
          <p className="text-red-500 text-lg font-semibold">Không tìm thấy đơn hàng</p>
          <Link to={ROUTES.HOME} className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center my-32">
      <div className="bg-white w-11/12 md:w-4/5 py-24 md:py-32 rounded-2xl text-center shadow-md">
        <div className="flex justify-center text-green-500 text-[5rem] mb-4">
          <FaCheck />
        </div>
        <h1 className="text-3xl font-bold mb-2">Đặt hàng thành công!</h1>
        <p className="text-gray-700 mb-1">Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là:</p>
        <p className="text-lg font-semibold mb-6">{order._id}</p>
        <div className="flex justify-center gap-4">
          <Link
            to={ROUTES.HOME}
            className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded"
          >
            Về trang chủ
          </Link>
          <Link
            to={`${ROUTES.ORDERS}/${order._id}`}
            className="border border-amber-600 hover:bg-amber-50 text-amber-600 font-medium py-2 px-4 rounded"
          >
            Xem chi tiết đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderReturn;

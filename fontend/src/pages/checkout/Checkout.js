import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { cartAPI, ordersAPI, paymentAPI } from "../../services/api";
import PromotionModal from "../../components/promotions/PromotionModal";
import PromotionDetailModal from "../../components/promotions/PromotionDetailModal";
import toast from "react-hot-toast";
import { FaAngleRight, FaMoneyBill, FaQrcode } from "react-icons/fa";
import ROUTES from "../../routes";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, setCartContext } = useAuth();
  const cart = location.state?.cart || { items: [] };

  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [promoDetailId, setPromoDetailId] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.items.reduce((sum, i) => sum + i.totalPrice, 0);

  const promotionCode = selectedPromotion?.promotion?.code;
  const discount = selectedPromotion?.discountAmount || 0;
  const shippingFee = totalItems > 0 ? 15000 : 0;
  const totalAmount = subtotal - discount + shippingFee;

  const paymentMethods = [
    { id: "COD", label: "Thanh toán khi nhận hàng", icon: <FaMoneyBill /> },
    { id: "VNPAY", label: "Thanh toán VNPAY", icon: <FaQrcode /> },
    { id: "MOMO", label: "Thanh toán MOMO", icon: <FaQrcode /> },
  ];
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [note, setNote] = useState("");

  const handleApplyPromo = (promoData, promoId) => {
    if (promoData === "INFO") {
      setPromoDetailId(promoId);
      setDetailModalOpen(true);
      return;
    }

    // Nếu nhấn nút đang áp mã thì hủy
    if (!promoData) {
      setSelectedPromotion(null);
      toast.success("Đã hủy mã giảm giá!");
      return;
    }

    // Áp mã mới
    setSelectedPromotion(promoData);
    toast.success("Đã áp dụng mã giảm giá!");
    setPromoModalOpen(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    // Kiểm tra thông tin giao hàng
    const address = user?.address || {};
    if (
      !user?.name ||
      !user?.phone ||
      !address.province?.name ||
      !address.district?.name ||
      !address.ward?.name ||
      !address.detail
    ) {
      toast((t) => (
        <div>
          Vui lòng điền đầy đủ thông tin giao hàng.
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                navigate(ROUTES.PROFILE);
              }}
              style={{
                padding: "6px 12px",
                backgroundColor: "#4f46e5",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Trang cá nhân
            </button>
          </div>
        </div>
      ), { duration: 8000 });
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart.items.map(item => ({
          productId: item.productId._id,
          name: item.productId.name,
          price: item.finalPrice,
          quantity: item.quantity,
          images: item.productId.images
        })),
        shippingAddress: {
          recipientName: user.name,
          phone: user.phone,
          province: user.address.province.name,
          district: user.address.district.name,
          ward: user.address.ward.name,
          detail: user.address.detail
        },
        paymentMethod: paymentMethod,
        totalAmount: totalAmount,
        promotionCode: promotionCode,
        discountAmount: discount,
        note: note
      };

      const order = await ordersAPI.create(orderData);
      const res = await paymentAPI.create(totalAmount, order?.data.data._id, paymentMethod);

      const updatedCart = await cartAPI.get();
      setCartContext(updatedCart.data.data);

      if (res?.data.data.paymentId) {
        navigate(`${ROUTES.ORDERRETURN}/${order?.data.data._id}`);
      } else {
        window.location.href = res.data.data;
      }

      toast.success("Đặt hàng thành công!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi đặt hàng.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6">
        {/* Left column */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Thông tin người nhận */}
          <div
            className="bg-white p-4 rounded-xl shadow cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg">Thông tin người nhận</span>
              <span className="text-gray-400"><FaAngleRight /></span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex flex-col lg:flex-row justify-between gap-2">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-blue-500">📍</span>
                  <span>Họ tên: {user?.name}</span>
                </div>
                <span>
                  Địa chỉ: {user?.address ? `${user.address.detail}, ${user.address.ward.name}, ${user.address.district.name}, ${user.address.province.name}` : ""}
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <span>Email: {user?.email}</span>
                <span>SĐT: {user?.phone}</span>
              </div>
            </div>
          </div>

          {/* Sản phẩm */}
          <div className="bg-white p-4 rounded-xl shadow">
            <span className="font-semibold text-lg">Sản phẩm</span>
            <div className="border-t border-gray-200 pt-2 mt-2 space-y-2">
              {cart.items.map(item => (
                <div
                  key={item.productId._id}
                  className="flex items-center justify-between py-3 px-1 rounded-lg hover:shadow-sm transition"
                >
                  {/* Ảnh */}
                  <div className="w-16 h-16 flex-shrink-0">
                    {item.productId.images?.[0] ? (
                      <img
                        src={item.productId.images[0]}
                        alt={item.productId.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                        <span className="text-gray-400">📦</span>
                      </div>
                    )}
                  </div>

                  {/* Tên + số lượng */}
                  <div className="flex flex-col flex-1 px-3">
                    <span className="font-semibold truncate">{item.productId.name}</span>
                    <span className="text-gray-500 text-sm">Số lượng: {item.quantity}</span>
                  </div>

                  {/* Giá 1 sp */}
                  <div className="text-gray-500 text-sm w-24 text-center">
                    {item.finalPrice?.toLocaleString("vi-VN")}₫
                  </div>

                  {/* Tổng */}
                  <div className="text-right font-bold text-amber-600 w-28">
                    {item.totalPrice?.toLocaleString("vi-VN")}₫
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Right column */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
          {/* Khuyến mãi */}
          <div className="bg-white p-4 rounded-xl shadow cursor-pointer" onClick={() => setPromoModalOpen(true)}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg">Khuyến mãi</span>
              <span className="text-gray-400"><FaAngleRight /></span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2 flex flex-col gap-2"></div>
            {selectedPromotion?.valid && (
              <div className="bg-amber-100 text-amber-700 p-2 rounded-lg mb-2">
                <p>Mã: {selectedPromotion.promotion.code}</p>
                <p>Giảm: {selectedPromotion.discountAmount.toLocaleString()}₫</p>
              </div>
            )}
          </div>

          {/* Ghi chú */}
          <div className="bg-white p-4 rounded-xl shadow">
            <span className="font-semibold text-lg">Ghi chú</span>
            <textarea
              className="w-full mt-2 p-2 border rounded-lg"
              placeholder="Nhập ghi chú cho đơn hàng"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          {/* Phương thức thanh toán */}
          <div className="bg-white p-4 rounded-xl shadow">
            <span className="font-semibold text-lg">Phương thức thanh toán</span>
            <div className="border-t border-gray-200 pt-2 mt-2 flex flex-col gap-2">
              {paymentMethods.map(pm => (
                <label key={pm.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm.id}
                    checked={paymentMethod === pm.id}  // dùng state
                    onChange={(e) => setPaymentMethod(e.target.value)} // cập nhật state
                    className="accent-amber-600"
                  />
                  {/* Icon */}
                  <span className="flex items-center gap-1">
                    {pm.icon}
                    {pm.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Chi tiết thanh toán */}
          <div className="bg-white p-4 rounded-xl shadow">
            <span className="font-semibold text-lg">Chi tiết thanh toán</span>
            <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
              <div className="flex justify-between">
                <span>Tổng tiền hàng</span>
                <span>{subtotal.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>{shippingFee.toLocaleString("vi-VN")}₫</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span>Giảm giá</span>
                  <span>-{discount.toLocaleString("vi-VN")}₫</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                <span>Tổng thanh toán</span>
                <span className="text-amber-600">{totalAmount.toLocaleString("vi-VN")}₫</span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 w-full bg-amber-600 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
            </button>
          </div>
        </div>
      </div>

      <PromotionModal
        open={promoModalOpen}
        onClose={() => setPromoModalOpen(false)}
        orderValue={subtotal}
        onApply={handleApplyPromo}
        appliedPromotion={selectedPromotion}
      />
      <PromotionDetailModal
        open={detailModalOpen}
        id={promoDetailId}
        onClose={() => setDetailModalOpen(false)}
      />
    </div>

  );
};

export default Checkout;

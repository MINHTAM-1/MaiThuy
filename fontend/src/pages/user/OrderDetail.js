import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ROUTES from "../../routes";
import toast from "react-hot-toast";

import { ordersAPI } from "../../services/api";
import Loading from "../../components/layout/Loading";

const orderStatusLabels = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    SHIPPING: "Đang giao hàng",
    DELIVERED: "Đã giao",
    CANCELLED: "Đã hủy",
};

const paymentLabels = {
    COD: "Thanh toán khi nhận hàng",
    VNPAY: "Thanh toán VNPAY",
    MOMO: "Thanh toán MOMO",
};

const paymentStatusColors = {
    PENDING: "warning",
    PAID: "success",
    FAILED: "error",
    REFUNDED: "primary",
};

const paymentStatusLabels = {
    PENDING: "Chưa thanh toán",
    PAID: "Đã thanh toán",
    FAILED: "Thất bại",
    REFUNDED: "Đã hoàn tiền",
};

const badgeStyles = {
    primary: "border-blue-600 text-blue-600 bg-blue-50",
    success: "border-green-600 text-green-600 bg-green-50",
    warning: "border-yellow-600 text-yellow-600 bg-yellow-50",
    error: "border-red-600 text-red-600 bg-red-50",
};

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [payment, setPayment] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await ordersAPI.getById(id);
                setOrder(res.data.data.order);
                setPayment(res.data.data.payment);
            } catch (err) {
                toast.error(err.response?.data?.message || "Không thể tải đơn hàng");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const address = order?.shippingAddress;
    const shippingAddress = `${address?.detail}, ${address?.ward}, ${address?.district}, ${address?.province}`;

    if (loading)
        return (
            <div className="my-32 flex justify-center">
                <Loading />
            </div>
        );

    if (!order)
        return (
            <div className="my-32 flex justify-center">
                <div className="bg-white shadow p-6 rounded text-center">
                    <p className="text-red-500 font-medium">Không tìm thấy đơn hàng</p>
                    <Link
                        to={ROUTES.HOME}
                        className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Về trang chủ
                    </Link>
                </div>
            </div>
        );

    return (
        <div className="my-20 flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow w-[95%] max-w-3xl">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold">Chi tiết đơn hàng</h2>
                    <span className="text-red-500">
                        {orderStatusLabels[order.status]}
                    </span>
                </div>

                <hr className="my-3" />

                {/* Thông tin */}
                <p><b>Mã đơn:</b> {order._id}</p>
                <p><b>Nguời đặt:</b> {address.recipientName}</p>
                <p><b>Số điện thoại:</b> {address.phone}</p>
                <p><b>Địa chỉ:</b> {shippingAddress}</p>
                <p><b>Ghi chú:</b> {order.note || " "}</p>
                <p><b>Thời gian đặt:</b> {new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                {payment.paidTimestamp && (
                    <p><b>Thời gian thanh toán:</b> {new Date(payment.paidTimestamp).toLocaleString("vi-VN")}</p>
                )}
                {payment.failedTimestamp && (
                    <p><b>Thời gian thanh toán thất bại:</b> {new Date(payment.failedTimestamp).toLocaleString("vi-VN")}</p>
                )}
                {payment.refundedTimestamp && (
                    <p><b>Thời gian hoàn tiền:</b> {new Date(payment.refundedTimestamp).toLocaleString("vi-VN")}</p>
                )}
                {order.confirmedTimestamp && (
                    <p><b>Thời gian xác nhận đơn:</b> {new Date(order.confirmedTimestamp).toLocaleString("vi-VN")}</p>
                )}
                {order.cancelledTimestamp && (
                    <p><b>Thời gian hủy đơn:</b> {new Date(order.cancelledTimestamp).toLocaleString("vi-VN")}</p>
                )}
                {order.shippingTimestamp && (
                    <p><b>Thời gian giao hàng:</b> {new Date(order.shippingTimestamp).toLocaleString("vi-VN")}</p>
                )}
                {order.deliveredTimestamp && (
                    <p><b>Thời gian nhận hàng:</b> {new Date(order.deliveredTimestamp).toLocaleString("vi-VN")}</p>
                )}

                <div className="flex flex-wrap gap-2 my-4">
                    {/* Payment Method */}
                    <span
                        className={`px-3 py-1 text-sm rounded-full border ${badgeStyles.primary}`}
                    >
                        {paymentLabels[payment.paymentMethod]}
                    </span>

                    {/* Payment Status */}
                    <span
                        className={`px-3 py-1 text-sm rounded-full border ${badgeStyles[paymentStatusColors[payment.status]]
                            }`}
                    >
                        {paymentStatusLabels[payment.status]}
                    </span>
                </div>

                {/* Sản phẩm */}
                <h3 className="text-lg font-semibold mt-5 mb-2">Sản phẩm</h3>
                <div>
                    {order.items.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-3 py-3 border-b cursor-pointer"
                            onClick={() => navigate(`${ROUTES.PRODUCTS}/${item.productId._id}`)}
                        >
                            <img
                                src={item.productId.images[0] || "/default.png"}
                                className="w-16 h-16 rounded object-cover"
                            />
                            <div className="flex-1">
                                <p className="font-medium">{item.productId.name}</p>
                                <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-600">{(item.price).toLocaleString("vi-VN")}đ</p>
                            </div>

                            <p>
                                {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                            </p>
                        </div>
                    ))}
                </div>


                {/* Chi tiết thanh toán */}
                <div className="space-y-1">
                    <div className="py-2 space-y-1">
                        <div className="flex justify-between text-gray-500">
                            <span>Tổng tiền hàng</span>
                            <span>{(order.totalAmount + order.discountAmount -15000).toLocaleString("vi-VN")} đ</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Phí vận chuyển</span>
                            <span>15.000₫</span>
                        </div>
                        {order.discountAmount > 0 && (
                            <div className="flex justify-between text-gray-500">
                                <span>Giảm giá</span>
                                <span>-{order.discountAmount.toLocaleString("vi-VN")}₫</span>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                        <span>Tổng thanh toán</span>
                        <span className="text-amber-600">{order.totalAmount.toLocaleString("vi-VN")}₫</span>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <Link
                        to={ROUTES.HOME}
                        className="px-4 py-2 bg-amber-600 text-white rounded"
                    >
                        Về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}
export default OrderDetail;
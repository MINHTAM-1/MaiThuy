import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from "../../components/layout/Loading";
import { ordersAPI } from "../../services/api";
import ROUTES from "../../routes";


const ORDER_TABS = [
    { key: "PENDING", label: "Chờ xác nhận" },
    { key: "CONFIRM", label: "Đã xác nhận" },
    { key: "SHIPPING", label: "Đang giao" },
    { key: "DELIVERED", label: "Đã giao" },
    { key: "CANCELLED", label: "Đã hủy" },
];

const Orders = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState("PENDING");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allOrders, setAllOrders] = useState([]);


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await ordersAPI.getAll();
                setAllOrders(res.data.data.data);
            } catch (err) {
                toast.error(err.response?.data?.message || "Lỗi tải đơn hàng");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        setOrders(allOrders.filter(o => o.orderStatus === tab));
    }, [tab, allOrders]);

    const getStatusLabel = (status) => {
        return ORDER_TABS.find((t) => t.key === status)?.label || status;
    };

    const handleCancel = async (id) => {
        setLoading(true);
        try {
            await ordersAPI.cancel(id);

            const updated = allOrders.map((o) =>
                o._id === id ? { ...o, orderStatus: "CANCELLED" } : o
            );

            setAllOrders(updated);
            setOrders(updated.filter((o) => o.orderStatus === tab));

            toast.success("Hủy đơn thành công");
        } catch (err) {
            toast.error(err.response?.data?.message || "Không thể hủy đơn");
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="my-20 flex justify-center">
                <Loading />
            </div>
        );
    }

    return (
        <div className="my-20 flex justify-center">
            <div className="w-[95%] max-w-4xl">
                {/* Tabs */}
                <div className="flex overflow-x-auto border-b mb-4">
                    {ORDER_TABS.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`px-4 py-2 whitespace-nowrap ${tab === t.key
                                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                                : "text-gray-600"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Nếu không có đơn */}
                {orders.length === 0 && (
                    <p className="text-center text-gray-500">Không có đơn hàng nào</p>
                )}

                {/* DANH SÁCH ĐƠN */}
                {orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-lg shadow mb-4 p-4">
                        <div className="flex justify-between">
                            <p className="text-lg font-medium">
                                Mã đơn: {order._id}
                            </p>
                            <p className="text-red-500">
                                {getStatusLabel(order.orderStatus)}
                            </p>
                        </div>

                        {/* SẢN PHẨM */}
                        <div
                            className="flex items-center gap-3 py-4 border-b cursor-pointer"
                            onClick={() =>
                                navigate(`${ROUTES.PRODUCTS}/${order.items[0].productId._id}`)
                            }
                        >
                            <img
                                src={order.items[0].productId?.images?.[0] || "/default.png"}
                                className="w-16 h-16 rounded object-cover"
                                alt=""
                            />
                            <div className="flex-1">
                                <p className="font-medium">{order.items[0].productId.name}</p>
                                <p className="text-sm text-gray-500">
                                    Số lượng: {order.items[0].quantity}
                                </p>
                            </div>

                            <p className="text-right">
                                {(order.items[0].price * order.items[0].quantity).toLocaleString(
                                    "vi-VN"
                                )}
                                đ
                            </p>
                        </div>

                        {order.items.length > 1 && (
                            <p className="text-sm text-gray-500 mt-1">
                                và {order.items.length - 1} sản phẩm khác
                            </p>
                        )}

                        {/* Tổng tiền */}
                        <div className="flex justify-between mt-3">
                            <p>
                                Tổng tiền ({order.items.length} sản phẩm):
                            </p>
                            <p className="font-semibold">
                                {order.totalAmount.toLocaleString("vi-VN")} đ
                            </p>
                        </div>

                        {/* BUTTONS */}
                        <div className="mt-4 flex justify-end gap-2">

                            {/* PENDING → Hủy đơn */}
                            {order.orderStatus === "PENDING" && (
                                <button
                                    className="border border-red-500 text-red-500 px-3 py-1 rounded hover:bg-red-50"
                                    onClick={() => handleCancel(order._id)}
                                >
                                    Hủy đơn
                                </button>
                            )}

                            {/* CONFIRMED → Đang xử lý */}
                            {order.orderStatus === "CONFIRMED" && (
                                <button
                                    disabled
                                    className="border px-3 py-1 rounded text-gray-500 bg-gray-100 cursor-not-allowed"
                                >
                                    Đang xử lý
                                </button>
                            )}

                            {/* SHIPPING → Đang giao */}
                            {order.orderStatus === "SHIPPING" && (
                                <button
                                    disabled
                                    className="border px-3 py-1 rounded text-gray-500 bg-gray-100 cursor-not-allowed"
                                >
                                    Đang giao
                                </button>
                            )}

                            {/* DELIVERED */}
                            {order.orderStatus === "DELIVERED" && (
                                <div className="flex gap-2">
                                    {order.isReviewed ? (
                                        <>
                                            <Link
                                                to={`${ROUTES.PRODUCTS}/${order.items[0].productId._id}`}
                                                className="bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700"
                                            >
                                                Mua lại
                                            </Link>

                                            <Link
                                                to={`${ROUTES.REVIEW}/${order._id}/${order.items[0].productId._id}`}
                                                className="border px-3 py-1 rounded hover:bg-gray-100"
                                            >
                                                Xem chi tiết đánh giá
                                            </Link>
                                        </>
                                    ) : (
                                        <Link
                                            to={`${ROUTES.REVIEW}/${order._id}/${order.items[0].productId._id}`}
                                            className="bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700"
                                        >
                                            Đánh giá
                                        </Link>
                                    )}
                                </div>
                            )}


                            {/* CANCELLED → Mua lại */}
                            {order.orderStatus === "CANCELLED" && (
                                <Link
                                    to={`${ROUTES.PRODUCTS}/${order.items[0].productId._id}`}
                                    className="bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700"
                                >
                                    Mua lại
                                </Link>
                            )}

                            {/* Xem chi tiết */}
                            <Link
                                to={`${ROUTES.ORDERS}/${order._id}`}
                                className="border px-3 py-1 rounded hover:bg-gray-100"
                            >
                                Xem chi tiết
                            </Link>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
export default Orders;
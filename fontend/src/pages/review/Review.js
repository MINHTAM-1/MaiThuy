import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { ordersAPI, reviewsAPI } from "../../services/api";
import ROUTES from "../../routes";

export default function Review() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [reviews, setReviews] = useState({});
    const [loading, setLoading] = useState(true);
    const [isEdited, setIsEdited] = useState(false); 

    useEffect(() => {
        let mounted = true;

        const fetchOrder = async () => {
            setLoading(true);
            try {
                const data = await ordersAPI.getById(orderId);
                const order = data.data.data;
                if (!mounted) return;

                setOrder(order);

                // Nếu đã đánh giá → load lại review từ API
                if (order.isReviewed) {
                    const res = await reviewsAPI.getByOrder(orderId);
                    const existingReviews = res.data.data;

                    const init = {};
                    existingReviews.forEach((rv) => {
                        init[rv.productId._id] = {
                            rating: rv.rating,
                            comment: rv.comment,
                            reviewId: rv._id,
                        };
                    });

                    setReviews(init);
                } else {
                    // Chưa đánh giá → init default
                    const init = {};
                    order.items.forEach((item) => {
                        init[item.productId._id] = {
                            rating: 5,
                            comment: "",
                        };
                    });
                    setReviews(init);
                }

            } catch (err) {
                toast.error("Lỗi khi tải đơn hàng");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchOrder();
        return () => (mounted = false);
    }, [orderId]);


    // ⭐ event: set rating + enable nút cập nhật
    const setStarReview = (productId, value) => {
        setReviews((prev) => ({
            ...prev,
            [productId]: { ...prev[productId], rating: value },
        }));
        setIsEdited(true);
    };

    // ⭐ event: set comment + enable nút cập nhật
    const setComment = (productId, text) => {
        setReviews((prev) => ({
            ...prev,
            [productId]: { ...prev[productId], comment: text },
        }));
        setIsEdited(true);
    };


    const handleSubmit = async () => {
        if (!order) return;
        setLoading(true);

        try {
            for (const item of order.items) {
                const pid = item.productId._id;
                const r = reviews[pid]

                if (!r) continue;

                const payload = {
                    productId: pid,
                    orderId,
                    rating: r.rating,
                    comment: r.comment || "",
                };

                if (order.isReviewed) {
                    // ⭐ update review
                    await reviewsAPI.update(r.reviewId, payload);
                } else {
                    // ⭐ create review
                    await reviewsAPI.create(payload);
                }
            }

            toast.success(order.isReviewed ? "Cập nhật thành công!" : "Đánh giá thành công!");
            navigate(-1);

        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi khi gửi đánh giá");
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-amber-600" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl text-center">
                    <h3 className="text-lg font-semibold text-red-600 mb-2">
                        Không tìm thấy đơn hàng
                    </h3>
                    <Link
                        to={ROUTES.HOME}
                        className="inline-block bg-amber-600 text-white px-4 py-2 rounded-md"
                    >
                        Về trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto my-12 px-4">
            <h2 className="text-xl font-semibold mb-4">
                {order.isReviewed ? "Cập nhật đánh giá" : "Đánh giá đơn hàng"} #{order._id}
            </h2>

            {order.items.map((item) => {
                const productId = item.productId._id;
                const state = reviews[productId] ?? { rating: 0, comment: "" };

                return (
                    <div key={productId} className="bg-white shadow-sm rounded-lg mb-6">
                        <div className="flex items-center gap-4 p-4 border-b">
                            <img
                                src={item.productId.images?.[0] || ""}
                                alt={item.productId.name}
                                className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                                <div className="font-medium">{item.productId.name}</div>
                                <div className="text-sm text-gray-500">{item.productId.type}</div>
                            </div>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* rating */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((i) => {
                                        const filled = state.rating >= i;
                                        return (
                                            <button
                                                key={i}
                                                disabled={order.isReviewed === false ? false : false}
                                                type="button"
                                                onClick={() => setStarReview(productId, i)}
                                                className="p-1"
                                            >
                                                {filled ? (
                                                    <FaStar className="text-amber-500" />
                                                ) : (
                                                    <FaRegStar className="text-gray-300" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="text-sm text-gray-600">{state.rating} sao</div>
                            </div>

                            {/* comment */}
                            <textarea
                                value={state.comment}
                                onChange={(e) => setComment(productId, e.target.value)}
                                className="w-full border rounded-md p-2 text-sm focus:outline-amber-500"
                                rows={3}
                                placeholder="Viết nhận xét của bạn..."
                            />
                        </div>
                    </div>
                );
            })}

            {/* Bottom Buttons */}
            <div className="sticky bottom-0 bg-white py-4 flex gap-4">

                <button
                    onClick={() => navigate(-1)}
                    className="w-1/3 border border-gray-400 py-3 rounded-md font-medium hover:bg-gray-100"
                >
                    Quay lại
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={order.isReviewed && !isEdited} // ⭐ disable khi chưa chỉnh sửa
                    className={`w-2/3 py-3 rounded-md font-semibold text-white 
            ${order.isReviewed
                            ? (isEdited ? "bg-amber-600 hover:bg-amber-700" : "bg-gray-400 cursor-not-allowed")
                            : "bg-amber-600 hover:bg-amber-700"
                        }`}
                >
                    {order.isReviewed ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                </button>
            </div>
        </div>
    );
}

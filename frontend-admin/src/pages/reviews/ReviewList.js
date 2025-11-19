import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { reviewsAPI } from "../../services/api";
import ROUTES from "../../routes";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";

const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    // LOAD DATA
    const fetchReviews = useCallback(
        async (resetPage = false) => {
            try {
                setLoading(true);
                setError("");

                const res = await reviewsAPI.getAll({
                    page: resetPage ? 0 : page,
                });

                if (res.data?.success) {
                    const data = res.data.data;

                    setReviews(data.items || []);
                    setFilteredReviews(data.items || []);
                    setTotalPages(data.totalPages || 1);
                } else {
                    setReviews([]);
                    setError("Không tìm thấy đánh giá");
                }
            } catch (err) {
                console.error(err);
                toast.error(err.response?.data?.message || "Không thể tải danh sách đánh giá");
            } finally {
                setLoading(false);
            }
        },
        [page]
    );

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    // SEARCH
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredReviews(reviews);
        } else {
            const term = searchTerm.toLowerCase();

            const filtered = reviews.filter((item) =>
                item.comment?.toLowerCase().includes(term) ||
                item.userId?.username?.toLowerCase().includes(term) ||
                item.productId?.name?.toLowerCase().includes(term)
            );

            setFilteredReviews(filtered);
        }
    }, [searchTerm, reviews]);

    if (loading) return <Loading />;

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="text-red-500 text-4xl mb-4">❌</div>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => fetchReviews(true)}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* HEADER PAGE */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Đánh giá</h1>
                <p className="text-gray-600 mt-2">Danh sách đánh giá sản phẩm của khách hàng</p>
            </div>

            {/* SEARCH */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 flex gap-4">
                <input
                    type="text"
                    placeholder="Tìm theo nội dung, tên user, tên sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />

                <button
                    type="button"
                    onClick={() => fetchReviews(true)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                    🔄 Làm mới
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredReviews.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">📭</div>
                        <p className="text-gray-500 text-lg mb-4">Không có đánh giá nào</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nội dung</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn hàng</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredReviews.map((r) => (
                                        <tr key={r._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium flex items-center gap-3 cursor-pointer"
                                                onClick={() => navigate(`${ROUTES.PRODUCTS}/${r.productId._id}`)}>
                                                {/* Product */}
                                                {r.productId?.images?.length > 0 ? (
                                                    <img
                                                        src={r.productId.images[0]}
                                                        alt={r.productId.name}
                                                        className="w-12 h-12 object-cover rounded-md"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                                                )}

                                                <span>{r.productId?.name || "—"}</span>
                                            </td>

                                            {/* User */}
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{r.userId?.name || "—"}</span>
                                                    <span className="text-gray-500 text-sm">{r.userId?.email || "—"}</span>
                                                </div>
                                            </td>
                                            {/* Rating */}
                                            <td className="px-6 py-4 text-sm text-amber-600 font-bold">
                                                {"⭐".repeat(r.rating)}
                                            </td>

                                            {/* Comment */}
                                            <td className="px-6 py-4 text-sm">
                                                {r.comment || "Không có nội dung"}
                                            </td>

                                            {/* Date */}
                                            <td className="px-6 py-4 text-sm">
                                                {new Date(r.createdAt).toLocaleString("vi-VN")}
                                            </td>

                                            {/* OrderId */}
                                            <td className="px-6 py-4 text-sm font-medium cursor-pointer"
                                                onClick={() => navigate(`${ROUTES.ORDERS}/${r.orderId}`)}>
                                                {r.orderId || "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={(newPage) => setPage(newPage)}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ReviewList;

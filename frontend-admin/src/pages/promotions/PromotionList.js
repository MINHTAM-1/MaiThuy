import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { promotionsAPI } from "../../services/api";
import confirmToast from "../../components/ConfirmToast";
import ROUTES from "../../routes";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";

const PromotionList = () => {
    const [promotions, setPromotions] = useState([]);
    const [filteredPromotions, setFilteredPromotions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchPromotions = useCallback(async (resetPage = false) => {
        try {
            setLoading(true);
            setError("");

            const res = await promotionsAPI.getAll({
                page: resetPage ? 0 : page,
            });

            if (res.data?.success) {
                const data = res.data.data;
                setPromotions(data.items || []);
                setFilteredPromotions(data.items || []);
                setTotalPages(data.totalPages || 1);
            } else {
                setPromotions([]);
                setError("Không tìm thấy mã khuyến mãi");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Không thể tải danh sách khuyến mãi");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredPromotions(promotions);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = promotions.filter((item) =>
                item.code.toLowerCase().includes(term) ||
                item.description.toLowerCase().includes(term)
            );
            setFilteredPromotions(filtered);
        }
    }, [searchTerm, promotions]);

    // DELETE promotion
    const handleDelete = async (id) => {
        const confirmed = await confirmToast({
            textConfirm: "Bạn có chắc muốn xóa mã khuyến mãi này?",
        });
        if (!confirmed) return;

        try {
            await promotionsAPI.delete(id);
            toast.success("Xóa thành công!");

            fetchPromotions(true);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Lỗi khi xóa khuyến mãi");
            setError(err.response?.data?.message || "Lỗi khi xóa khuyến mãi");
        }
    };

    if (loading) return <Loading />;

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="text-red-500 text-4xl mb-4">❌</div>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => fetchPromotions(true)}
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
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Quản lý Khuyến mãi</h1>
                        <p className="text-gray-600 mt-2">
                            Danh sách mã khuyến mãi và chương trình giảm giá
                        </p>
                    </div>

                    <Link
                        to={ROUTES.ADD_PROMOTION}
                        className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors flex items-center"
                    >
                        <span className="mr-2">➕</span>
                        Thêm khuyến mãi
                    </Link>
                </div>
            </div>

            {/* SEARCH */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 flex gap-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo mã hoặc mô tả..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />

                <button
                    type="button"
                    onClick={() => fetchPromotions(true)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                    🔄 Làm mới
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredPromotions.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">📭</div>
                        <p className="text-gray-500 text-lg mb-4">Không có khuyến mãi nào</p>
                        <Link
                            to={ROUTES.ADD_PROMOTION}
                            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors inline-flex items-center"
                        >
                            <span className="mr-2">➕</span>
                            Thêm khuyến mãi đầu tiên
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Mã
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Mô tả
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Giảm giá
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Thời gian
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Trạng thái
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredPromotions.map((p) => {
                                        const discount =
                                            p.discountType === "percent"
                                                ? `${p.discountValue}%`
                                                : `${p.discountValue.toLocaleString()}đ`;

                                        return (
                                            <tr key={p._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm font-bold">{p.code}</td>

                                                <td className="px-6 py-4 text-sm">{p.description}</td>

                                                <td className="px-6 py-4 text-sm font-medium text-amber-700">
                                                    {discount}
                                                </td>

                                                <td className="px-6 py-4 text-sm">
                                                    {new Date(p.startDate).toLocaleDateString()} →{" "}
                                                    {new Date(p.endDate).toLocaleDateString()}
                                                </td>

                                                <td className="px-6 py-4 text-sm">
                                                    {p.active ? (
                                                        <span className="text-green-600 font-medium">Đang hoạt động</span>
                                                    ) : (
                                                        <span className="text-gray-500">Ngừng</span>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-3">
                                                        <Link
                                                            to={`${ROUTES.PROMOTIONS}/${p._id}`}
                                                            className="text-amber-600 hover:text-amber-900"
                                                        >
                                                            ✏️ Sửa
                                                        </Link>

                                                        <button
                                                            onClick={() => handleDelete(p._id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            🗑️ Xóa
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
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

export default PromotionList;

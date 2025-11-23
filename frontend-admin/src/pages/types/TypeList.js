import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { typesAPI } from "../../services/api";
import confirmToast from "../../components/ConfirmToast";
import ROUTES from "../../routes";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";

const TypeList = () => {
    const [types, setTypes] = useState([]);
    const [filteredTypes, setFilteredTypes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchTypes = useCallback(async (resetPage = false) => {
        try {
            setLoading(true);
            setError("");

            const res = await typesAPI.getAll({
                page: resetPage ? 0 : page,
            });

            if (res.data?.success) {
                const data = res.data.data;
                setTypes(data.items || []);
                setFilteredTypes(data.items || []);
                setTotalPages(data.totalPages || 1);
            }
            else {
                setTypes([]);
                setError("Không tìm thấy nhóm sản phẩm");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Không thể tải danh sách nhóm sản phẩm");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchTypes();
    }, [fetchTypes]);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredTypes(types);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = types.filter((item) =>
                item.name.toLowerCase().includes(term) ||
                (item.slug && item.slug.toLowerCase().includes(term))
            );

            setFilteredTypes(filtered);
        }
    }, [searchTerm, types]);


    // DELETE 
    const handleDelete = async (id) => {
        const confirmed = await confirmToast({ textConfirm: "Bạn có chắc muốn xóa nhóm sản phẩm này?" });
        if (!confirmed) return;

        try {
            await typesAPI.delete(id);
            toast.success("Xóa thành công!");

            // Reload
            fetchTypes(true);
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi xóa nhóm sản phẩm");
            setError(err.response?.data?.message || "Lỗi khi xóa nhóm sản phẩm")
        }
    };

    if (loading) {
        return (
            <Loading />
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="text-red-500 text-4xl mb-4">❌</div>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => fetchTypes(true)}
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
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Quản lý Nhóm sản phẩm</h1>
                        <p className="text-gray-600 mt-2">Quản lý danh sách nhóm sản phẩm trong cửa hàng</p>
                    </div>
                    <Link
                        to={ROUTES.ADD_TYPE}
                        className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 
                        transition-colors flex items-center"
                    >
                        <span className="mr-2">➕</span>
                        Thêm nhóm sản phẩm
                    </Link>
                </div>
            </div>

            {/* Search and Filters */}
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
                    onClick={() => fetchTypes(true)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                    🔄 Làm mới
                </button>
            </div>

            {/* Types Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {!Array.isArray(types) || types.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">📦</div>
                        <p className="text-gray-500 text-lg mb-4">Không có nhóm sản phẩm nào</p>
                        <Link
                            to={ROUTES.ADD_TYPE}
                            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 
                            transition-colors inline-flex items-center"
                        >
                            <span className="mr-2">➕</span>
                            Thêm nhóm sản phẩm đầu tiên
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 
                                        uppercase tracking-wider">
                                            Nhóm sản phẩm
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 
                                        uppercase tracking-wider">
                                            Mô tả
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 
                                        uppercase tracking-wider">
                                            Slug
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500
                                         uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredTypes.map((type) => {
                                        return (
                                            <tr key={type._id || type.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            {type.images?.[0] ? (
                                                                <img
                                                                    className="h-10 w-10 rounded-lg object-cover"
                                                                    src={type.images[0]}
                                                                    alt={type.name}
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 bg-amber-100 rounded-lg flex 
                                                                items-center justify-center">
                                                                    <span className="text-amber-600">☕</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {type.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {type.description}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {type.slug}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            to={`${ROUTES.TYPES}/${type._id}`}
                                                            className="text-amber-600 hover:text-amber-900"
                                                        >
                                                            ✏️ Sửa
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(type._id || type.id)}
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

                        {/* Pagination */}
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

export default TypeList;
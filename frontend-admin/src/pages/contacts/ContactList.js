import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { contactsAPI } from "../../services/api";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchContacts = useCallback(
        async (resetPage = false) => {
            try {
                setLoading(true);
                setError("");

                const res = await contactsAPI.getAll({
                    page: resetPage ? 0 : page,
                });

                if (res.data?.success) {
                    const data = res.data.data;
                    setContacts(data.items || []);
                    setFilteredContacts(data.items || []);
                    setTotalPages(data.totalPages || 1);
                } else {
                    setContacts([]);
                    setError("Không tìm thấy liên hệ");
                }
            } catch (err) {
                console.error(err);
                toast.error(err.response?.data?.message || "Không thể tải danh sách liên hệ");
            } finally {
                setLoading(false);
            }
        },
        [page]
    );

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    // SEARCH
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredContacts(contacts);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = contacts.filter(
                (c) =>
                    c.name?.toLowerCase().includes(term) ||
                    c.email?.toLowerCase().includes(term) ||
                    c.message?.toLowerCase().includes(term)
            );
            setFilteredContacts(filtered);
        }
    }, [searchTerm, contacts]);

    const getStatusText = (status) => {
        const statusMap = {
            'new': { text: 'Mới', color: 'bg-green-100 text-green-800', badge: '🕒' },
            'replied': { text: 'Đã trả lời', color: 'bg-yellow-100 text-yellow-800', badge: '✅' },
        };
        return statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800', badge: '❓' };
    };

    const updateContactState = async (contactId, newState) => {
        try {
            await contactsAPI.update(contactId, { state: newState });
            setContacts(contacts.map(contact =>
                contact._id === contactId ? { ...contact, state: newState } : contact
            ));
            toast.success(`Đã cập nhật trạng thái thành công!`);
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái!");
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
                        onClick={() => fetchContacts(true)}
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
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Liên hệ</h1>
                <p className="text-gray-600 mt-2">Danh sách tin nhắn từ khách hàng</p>
            </div>

            {/* SEARCH */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 flex gap-4">
                <input
                    type="text"
                    placeholder="Tìm theo tên, email hoặc nội dung..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                    type="button"
                    onClick={() => fetchContacts(true)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                    🔄 Làm mới
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredContacts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">📭</div>
                        <p className="text-gray-500 text-lg mb-4">Không có liên hệ nào</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nội dung</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredContacts.map((c) => (
                                        <tr key={c._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium">{c.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{c.email}</td>
                                            <td className="px-6 py-4 text-sm">{c.message}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusText(c.state).color}`}>
                                                    <span className="mr-1">{getStatusText(c.state).badge}</span>
                                                    {getStatusText(c.state).text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">{new Date(c.createdAt).toLocaleString("vi-VN")}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => updateContactState(c._id, 'replied')}
                                                    className="text-blue-600 hover:text-blue-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                    disabled={c.state !== 'new'}
                                                >
                                                    Đã trả lời
                                                </button>
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

export default ContactList;

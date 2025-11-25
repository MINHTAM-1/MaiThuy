import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';
import ROUTES from '../../routes';
import { paymentsAPI } from '../../services/api';

const PaymentDetail = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [payment, setPayment] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                setLoading(true);
                const res = await paymentsAPI.getById(id);
                if (res.data.success) {
                    setPayment(res.data.data);
                } else {
                    toast.error("Không tìm thấy thanh toán");
                }
            } catch (err) {
                console.error("Lỗi khi lấy chi tiết thanh toán:", err);
                toast.error(err.response?.data?.message || "Có lỗi xảy ra");
            } finally {
                setLoading(false);
            }
        };
        fetchPayment();
    }, [id]);

    if (loading) return <Loading />;

    if (!payment) return <div className="p-6 text-center">Không tìm thấy thanh toán</div>;

    const formatDate = (dateString) =>
        dateString ? new Date(dateString).toLocaleString('vi-VN') : '-';

    const getStatusText = (status) => {
        const statusMap = {
            PENDING: { text: "Chờ thanh toán", color: "bg-yellow-100 text-yellow-800" },
            PAID: { text: "Đã thanh toán", color: "bg-green-100 text-green-800" },
            FAILED: { text: "Thanh toán thất bại", color: "bg-red-100 text-red-800" },
            REFUNDED: { text: "Đã hoàn tiền", color: "bg-blue-100 text-blue-800" },
        };
        return statusMap[status] || { text: status, color: "bg-gray-100 text-gray-800" };
    };

    const statusInfo = getStatusText(payment.status);

    const updatePaymentStatus = async (status) => {
        try {
            const res = await paymentsAPI.update(id, { status });
            const updatedPayment = res.data.data;
            if (updatedPayment) {
                toast.success(res.data.message || "Cập nhật trạng thái thanh toán thành công!");
                setPayment(prev => ({
                    ...prev,
                    status: updatedPayment.status,
                    paidTimestamp: updatedPayment.paidTimestamp,
                    failedTimestamp: updatedPayment.failedTimestamp,
                }));
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái!");
        }
    };

    const onRefund = async () => {
        try {
            const res = await paymentsAPI.refundMomo(id);
            if (res.data.data.message) {
                toast.success(res.data.data.message || "Hoàn tiền thành công!");
                setPayment(payment._id === id ? { ...payment, status: 'REFUNDED' } : payment);
            }

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Hoàn tiền thất bại!");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <Link to={ROUTES.PAYMENTS} className="text-amber-600 hover:text-amber-700 mb-2 inline-block">
                                ← Quay lại danh sách thanh toán
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng #{payment._id}</h1>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                            {statusInfo.text}
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Mã đơn hàng:</span>
                                <span className="font-medium text-blue-600 cursor-pointer"
                                    onClick={() => navigate(`${ROUTES.ORDERS}/${payment.orderId}`)}
                                >{payment.orderId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Phương thức thanh toán:</span>
                                <span className="font-medium">{payment.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Số tiền:</span>
                                <span className="font-medium">{payment.amount?.toLocaleString('vi-VN')}₫</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Trạng thái:</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                    {statusInfo.text}
                                </span>
                            </div>

                            {payment.transactionId && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Transaction ID:</span>
                                    <span className="font-medium">{payment.transactionId}</span>
                                </div>
                            )}

                            {payment.paidTimestamp && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Thời gian thanh toán:</span>
                                    <span className="font-medium">{formatDate(payment.paidTimestamp)}</span>
                                </div>
                            )}

                            {payment.refundedTimestamp && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Thời gian hoàn tiền:</span>
                                    <span className="font-medium">{formatDate(payment.refundedTimestamp)}</span>
                                </div>
                            )}

                            {payment.rawResponse && Object.keys(payment.rawResponse).length > 0 && (
                                <div>
                                    <span className="text-gray-600">Thông tin phản hồi từ cổng thanh toán:</span>
                                    <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
                                        {JSON.stringify(payment.rawResponse, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
                            <div className="space-y-2">
                                {payment.paymentMethod === 'COD' && (
                                    <>
                                        <button
                                            onClick={() => updatePaymentStatus('PAID')}
                                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg 
                                        hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                            disabled={payment.status !== 'PENDING'}
                                        >
                                            Xác nhận thanh toán
                                        </button>
                                        <button
                                            onClick={() => updatePaymentStatus('FAILED')}
                                            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg 
                                        disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                                            disabled={!['PENDING', 'CONFIRMED'].includes(payment.status)}
                                        >
                                            Thanh toán thất bại
                                        </button>
                                    </>
                                )}
                                {payment.paymentMethod !== 'COD' && (
                                    <button
                                        onClick={() => onRefund()}
                                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg 
                                    hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        disabled={payment.status !== 'PAID'}
                                    >
                                        Hoàn tiền
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaymentDetail;

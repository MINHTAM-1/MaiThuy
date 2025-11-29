import { useState, useEffect, useCallback } from 'react';
import { paymentsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const fetchPayments = useCallback(async (pageNumber = page) => {
    try {
      setLoading(true);
      const res = await paymentsAPI.getAll({ page: pageNumber });
      if (res.data.success) {
        const data = res.data.data.items;

        setPayments(data || []);
        setTotalPages(res.data.data.totalPages || 1);
        console.log(data)
      } else {
        setPayments([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách thanh toán:", err);
      setError("Không thể tải danh sách thanh toán");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPayments(page);
  }, [fetchPayments, page]);

  // 🔍 Filter + Search
  useEffect(() => {
    const filtered = payments.filter(payment => {
      const matchesStatus =
        filterStatus === "all" || payment.status === filterStatus;

      const matchesSearch =
        payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.orderId?._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });

    setFilteredPayments(filtered);
  }, [payments, filterStatus, searchTerm]);

  // Trạng thái thanh toán
  const getPaymentStatus = (status) => {
    const map = {
      "PENDING": { text: "Chưa thanh toán", color: "bg-yellow-100 text-yellow-800" },
      "PAID": { text: "Đã thanh toán", color: "bg-green-100 text-green-800" },
      "FAILED": { text: "Thất bại", color: "bg-red-100 text-red-800" },
      "REFUNDED": { text: "Đã hoàn tiền", color: "bg-blue-100 text-blue-800" },
    };
    return map[status] || map["PENDING"];
  };

  // Cập nhật trạng thái thanh toán
  const updatePaymentStatus = async (id, status) => {
    try {
      await paymentsAPI.update(id, { status });
      setPayments(
        payments.map(p => p._id === id ? { ...p, status } : p)
      );
      toast.success("Cập nhật trạng thái thanh toán thành công");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Lỗi cập nhật thanh toán!");
    }
  };

  const onRefund = async (paymentId) => {
    try {
      const res = await paymentsAPI.refundMomo(paymentId);
      if (res.data.data.message) {
        toast.success(res.data.data.message || "Hoàn tiền thành công!");
        setPayments(payments.map(payment =>
          payment._id === paymentId ? { ...payment, status: 'REFUNDED' } : payment
        ));
      }

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Hoàn tiền thất bại!");
    }
  };


  const formatDate = (date) =>
    new Date(date).toLocaleString("vi-VN");

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
      .format(amount || 0);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchPayments(page)}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Quản lý thanh toán</h1>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="PENDING">Chờ thanh toán</option>
          <option value="PAID">Đã thanh toán</option>
          <option value="FAILED">Thất bại</option>
          <option value="REFUNDED">Hoàn tiền</option>
        </select>

        <input
          type="text"
          placeholder="Tìm theo mã giao dịch / OrderID / phương thức"
          className="border px-3 py-2 rounded flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã giao dịch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phương thức</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-500 text-lg">Không tìm thấy thanh toán nào.</p>
                </td>
              </tr>
            ) : (
              filteredPayments.map((fpayment) => {
                return (
                <tr key={fpayment._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`${ROUTES.PAYMENTS}/${fpayment._id}`)}>
                  <td className="p-3">{fpayment.transactionId || "—"}</td>

                  <td
                    className="px-6 py-4 whitespace-nowrap text-blue-600 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`${ROUTES.ORDERS}/${fpayment.orderId}`);
                    }}
                  >
                    {fpayment.orderId}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">{fpayment.paymentMethod}</td>

                  <td className="px-6 py-4 whitespace-nowrap font-semibold">{formatMoney(fpayment.amount)}</td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded ${getPaymentStatus(fpayment.status).color}`}>
                      {getPaymentStatus(fpayment.status).text}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(fpayment.createdAt)}</td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {fpayment.paymentMethod === 'COD' && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updatePaymentStatus(fpayment._id, 'PAID');
                          }}
                          className="text-blue-600 hover:text-blue-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                          disabled={fpayment.status !== 'PENDING'}
                        >
                          Đã thanh toán
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updatePaymentStatus(fpayment._id, 'FAILED');
                          }}
                          className="text-purple-600 hover:text-purple-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                          disabled={!['PENDING'].includes(fpayment.status)}
                        >
                          Thanh toán thất bại
                        </button>
                      </>
                    )}
                    {fpayment.paymentMethod !== 'COD' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRefund(fpayment._id);
                        }}
                        className="text-green-600 hover:text-green-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                        disabled={fpayment.status !== 'PAID'}
                      >
                        Hoàn tiền
                      </button>
                    )}
                  </td>
                </tr>
                )
              })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};

export default PaymentList;

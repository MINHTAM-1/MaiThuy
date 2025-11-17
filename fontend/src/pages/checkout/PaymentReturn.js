import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from "../../components/layout/Loading";
import ROUTES from "../../routes";

export default function PaymentReturn() {
    const [status, setStatus] = useState("loading");
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");


    useEffect(() => {
        const resultCode = searchParams.get("resultCode");

        if (resultCode === "0") {
            setStatus("success");
            toast.success("Thanh toán thành công! 🎉");
        } else {
            setStatus("failed");
            toast.error("Thanh toán thất bại. Vui lòng thử lại.");
        }
    }, [searchParams]);

    if (status === "loading") {
        return (
            <Loading fullScreen={true} />
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-20 px-4">
            <div className="bg-white p-10 md:p-20 rounded-3xl shadow-lg text-center w-full max-w-2xl">
                {status === "success" ? (
                    <>
                        <div className="text-green-500 text-[80px] mb-4">✓</div>
                        <h2 className="text-3xl font-semibold mb-2">Thanh toán thành công!</h2>
                        <p className="mb-1">Cảm ơn bạn đã thanh toán qua MoMo 🎉</p>
                        <p className="mb-1">Mã đơn hàng của bạn là:</p>
                        <p className="text-xl font-semibold mb-4">{orderId}</p>
                    </>
                ) : (
                    <>
                        <div className="text-red-500 text-[80px] mb-4">✕</div>
                        <h2 className="text-3xl font-bold mb-2">Thanh toán thất bại</h2>
                        <p className="mb-1">Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức khác.</p>
                    </>
                )}

                <div className="flex flex-wrap justify-center gap-3 mt-6">
                    <Link to={ROUTES.HOME} className="bg-amber-600 text-white px-5 py-2 rounded-md hover:bg-amber-700 transition">
                        Về trang chủ
                    </Link>
                    <Link to={`${ROUTES.ORDERS}/${orderId}`} className="border border-amber-600 text-amber-600 px-5 py-2 rounded-md hover:bg-amber-100 transition">
                        Xem chi tiết đơn hàng
                    </Link>
                    {status === "failed" && (
                        <Link to={ROUTES.CART} className="border border-gray-400 px-5 py-2 rounded-md hover:bg-gray-100 transition">
                            Thử lại thanh toán
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

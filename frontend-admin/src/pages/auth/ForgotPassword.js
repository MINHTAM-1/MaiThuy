import { Link, useNavigate } from "react-router-dom";
import ROUTES from "../../routes";
import { useState } from "react";
import { authAPI } from "../../services/api";
import toast from "react-hot-toast";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authAPI.forgotPassword({ email });
            if (response.data.success) {
                toast.success("Mã OTP đã được gửi vào email của bạn.");
                localStorage.setItem("email", email)
                navigate(ROUTES.VALIDATE_RESETCODE);
            } else {
                toast.error(response.data.message || "Không gửi được OTP.");
            }
        } catch (err) {
            toast.error(err.response.data.message || "Có lỗi xảy ra.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-cover"
            >
            <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">

                    {/* Left side */}
                    <div className="bg-amber-900 text-white p-12 flex flex-col justify-center">
                        <div className="flex items-center space-x-3 mb-8">
                            <span className="text-3xl">☕</span>
                            <span className="text-2xl font-bold">MAITHUY Coffee</span>
                        </div>
                        <p className="text-2xl font-bold mb-4">Quên mật khẩu</p>
                        <p className="text-amber-100 mb-8">
                            Nhập email để nhận OTP và đặt lại mật khẩu.
                        </p>
                        <Link
                            to={ROUTES.LOGIN}
                            className="bg-white text-amber-800 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50"
                        >
                            Quay lại đăng nhập
                        </Link>
                    </div>

                    {/* Right side - Form */}
                    <div className="p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="abc@maithuycoffee.com"
                                    required
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 rounded-lg font-semibold 
                                    ${loading ? "bg-gray-400" : "bg-amber-600 hover:bg-amber-700 text-white"}`
                                }
                            >
                                {loading ? "Đang gửi..." : "Gửi OTP"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

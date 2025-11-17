import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <section className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center py-8 space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left">
              <h4 className="text-xl font-bold mb-2">Đăng kí nhận thông báo</h4>
              <p className="text-gray-300">
                Cập nhật các khuyến mãi mới nhất của{" "}
                <span className="text-amber-300 font-semibold">MAITHUY</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <span className="px-4 py-2 rounded-lg text-gray-900 w-full sm:w-64 flex items-center justify-center bg-gray-100">
                Nhấn Đăng ký để nhận thông tin
              </span>

              <Link
                to="/register"
                className="bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors whitespace-nowrap flex items-center justify-center"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1 - Contact Info */}
            <div className="space-y-4">
              <img
                src="/assets/logo_3_white.png"
                alt="MAITHUY Coffee"
                className="h-12 w-auto"
              />
              <div className="space-y-2">
                <h4 className="font-semibold text-amber-200">Liên hệ</h4>
                <p className="text-gray-300 text-sm">
                  <strong>Địa chỉ:</strong> 34 Đ. An Bình, Phường 6, Quận 5,
                  TP.HCM
                </p>
                <p className="text-gray-300 text-sm">
                  <strong>Số điện thoại:</strong> (+84) 816232452
                </p>
                <p className="text-gray-300 text-sm">
                  <strong>Giờ làm việc:</strong> T2 - CN, 7:00 - 22:00
                </p>
              </div>

              <div className="pt-4">
                <h4 className="font-semibold text-amber-200 mb-3">
                  Theo dõi chúng tôi
                </h4>
                <div className="flex space-x-4">
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <i className="fab fa-facebook-f text-xl"></i>
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <i className="fab fa-twitter text-xl"></i>
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <i className="fab fa-instagram text-xl"></i>
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <i className="fab fa-youtube text-xl"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Column 2 - About Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-amber-200">Về MAITHUY</h4>
              <div className="space-y-2">
                <Link
                  to="/about"
                  className="block text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Giới thiệu
                </Link>
                <button className="block text-gray-300 hover:text-white transition-colors text-sm text-left w-full">
                  Chính Sách
                </button>
                <button className="block text-gray-300 hover:text-white transition-colors text-sm text-left w-full">
                  Điều khoản
                </button>
                <button className="block text-gray-300 hover:text-white transition-colors text-sm text-left w-full">
                  Thông tin đặt hàng
                </button>
              </div>
            </div>

            {/* Column 3 - Support Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-amber-200">Hỗ trợ</h4>
              <div className="space-y-2">
                <button className="block text-gray-300 hover:text-white transition-colors text-sm text-left w-full">
                  Hướng dẫn mua hàng
                </button>
                <button className="block text-gray-300 hover:text-white transition-colors text-sm text-left w-full">
                  Chính sách đổi trả
                </button>
                <button className="block text-gray-300 hover:text-white transition-colors text-sm text-left w-full">
                  Vận chuyển
                </button>
                <button className="block text-gray-300 hover:text-white transition-colors text-sm text-left w-full">
                  Bảo mật thông tin
                </button>
              </div>
            </div>

            {/* Column 4 - Payment Methods */}
            <div className="space-y-4">
              <h4 className="font-semibold text-amber-200">
                Thanh Toán An Toàn
              </h4>
              <div className="flex flex-wrap gap-4">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <i className="fa-brands fa-cc-visa text-3xl"></i>
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <i className="fa-brands fa-cc-mastercard text-3xl"></i>
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <i className="fa-brands fa-cc-paypal text-3xl"></i>
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <i className="fa-brands fa-cc-apple-pay text-3xl"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;

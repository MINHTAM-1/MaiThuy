import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes";

const About = () => {
   const navigate = useNavigate();
  const features = [
    {
      icon: "🌱",
      title: "Nguyên liệu chất lượng",
      description: "Sử dụng 100% hạt cà phê Arabica và Robusta cao cấp từ vùng nguyên liệu nổi tiếng"
    },
    {
      icon: "🔥",
      title: "Rang xay tươi mỗi ngày",
      description: "Đảm bảo hương vị tươi ngon nhất đến tay khách hàng với quy trình rang xay công phu"
    },
    {
      icon: "👨‍🍳",
      title: "Barista chuyên nghiệp",
      description: "Đội ngũ nhân viên được đào tạo bài bản, nhiệt tình và giàu kinh nghiệm"
    },
    {
      icon: "🚚",
      title: "Giao hàng nhanh chóng",
      description: "Miễn phí giao hàng trong nội thành TP.HCM, đóng gói cẩn thận"
    }
  ];

  const milestones = [
    { year: "2018", event: "Thành lập MAITHUY COFFEE", description: "Bắt đầu với cửa hàng đầu tiên tại Quận 5" },
    { year: "2019", event: "Mở rộng sản phẩm", description: "Phát triển thêm 10 dòng sản phẩm mới" },
    { year: "2020", event: "Top 10 Thương hiệu", description: "Được vinh danh Top 10 thương hiệu cà phê được yêu thích" },
    { year: "2023", event: "10.000+ khách hàng", description: "Đạt mốc phục vụ hơn 10.000 khách hàng thân thiết" }
  ];

  return (
    <section className="about py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Về <span className="text-amber-600">MAITHUY COFFEE</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Với hơn 5 năm kinh nghiệm trong ngành cà phê, chúng tôi tự hào mang đến những sản phẩm 
            chất lượng nhất từ những hạt cà phê được tuyển chọn kỹ lưỡng
          </p>
        </div>

        {/* Story Section - Kết hợp cũ và mới */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Câu chuyện của chúng tôi</h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                <span className="font-semibold text-amber-600">MAITHUY COFFEE</span> được thành lập năm 2018 
                với mong muốn mang đến cho khách hàng những ly cà phê chất lượng cao với hương vị đặc trưng, 
                kết hợp giữa truyền thống và hiện đại.
              </p>
              <p>
                Chúng tôi tin rằng một ly cà phê ngon không chỉ đơn thuần là thức uống, 
                mà còn là <span className="text-amber-600">trải nghiệm</span>, là <span className="text-amber-600">câu chuyện</span>, 
                là <span className="text-amber-600">cảm xúc</span> được gửi gắm qua từng hạt cà phê.
              </p>
              <p>
                Từ những hạt cà phê được tuyển chọn kỹ lưỡng từ vùng nguyên liệu nổi tiếng, 
                qua quy trình rang xay công phu, cho đến tay những barista tài năng - 
                tất cả đều được chúng tôi chăm chút tỉ mỉ trong từng công đoạn.
              </p>
            </div>

            {/* Milestones Timeline */}
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Chặng đường phát triển</h3>
              <div className="space-y-3">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-4 p-3 bg-amber-50 rounded-lg">
                    <div className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold min-w-16 text-center">
                      {milestone.year}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{milestone.event}</h4>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Awards & Recognition */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-8 text-center shadow-xl">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold mb-2">Top 10</h3>
              <p className="text-amber-100 text-lg">Thương hiệu cà phê được yêu thích nhất 2023</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-100 rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">⭐</div>
                <h4 className="font-semibold text-gray-900">4.9/5</h4>
                <p className="text-sm text-gray-600">Đánh giá</p>
              </div>
              <div className="bg-amber-100 rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">👥</div>
                <h4 className="font-semibold text-gray-900">10K+</h4>
                <p className="text-sm text-gray-600">Khách hàng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Điểm nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 border border-amber-100"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-amber-50 rounded-2xl p-8">
            <div className="text-amber-600 text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Sứ mệnh</h3>
            <p className="text-gray-700 leading-relaxed">
              Mang đến cho khách hàng những trải nghiệm cà phê tuyệt vời nhất thông qua 
              chất lượng sản phẩm vượt trội, dịch vụ chuyên nghiệp và không gian thân thiện.
            </p>
          </div>
          <div className="bg-amber-900 text-white rounded-2xl p-8">
            <div className="text-amber-200 text-4xl mb-4">🔭</div>
            <h3 className="text-2xl font-bold mb-4">Tầm nhìn</h3>
            <p className="text-amber-100 leading-relaxed">
              Trở thành thương hiệu cà phê hàng đầu Việt Nam, lan tỏa văn hóa cà phê chất lượng 
              và góp phần nâng cao đời sống tinh thần của cộng đồng.
            </p>
          </div>
        </div>

        {/* Stats Section - Kết hợp cả hai phiên bản */}
        <div className="bg-gradient-to-r from-amber-800 to-amber-600 text-white rounded-2xl p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">MAITHUY COFFEE trong số</h2>
            <p className="text-amber-200 text-lg">Những con số biết nói về hành trình của chúng tôi</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-amber-200">5+</div>
              <p className="text-amber-100 font-semibold">Năm kinh nghiệm</p>
              <p className="text-amber-200 text-sm">Thành lập 2018</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-amber-200">10K+</div>
              <p className="text-amber-100 font-semibold">Khách hàng</p>
              <p className="text-amber-200 text-sm">Hài lòng</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-amber-200">50+</div>
              <p className="text-amber-100 font-semibold">Sản phẩm</p>
              <p className="text-amber-200 text-sm">Đa dạng</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-amber-200">99%</div>
              <p className="text-amber-100 font-semibold">Hài lòng</p>
              <p className="text-amber-200 text-sm">Tỷ lệ phản hồi tích cực</p>
            </div>
          </div>

          {/* Additional mini stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-amber-500">
            <div className="text-center">
              <div className="text-2xl font-bold">100%</div>
              <p className="text-amber-200 text-sm">Nguyên liệu tự nhiên</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <p className="text-amber-200 text-sm">Hỗ trợ khách hàng</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">5⭐</div>
              <p className="text-amber-200 text-sm">Đánh giá trung bình</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Sẵn sàng khám phá hương vị?</h3>
          <p className="text-gray-600 mb-6">Trải nghiệm sự khác biệt từ MAITHUY COFFEE ngay hôm nay</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate(ROUTES.PRODUCTS)}
            className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors shadow-lg">
              Xem sản phẩm
            </button>
            <button onClick={() => navigate(ROUTES.CONTACT)}
            className="border-2 border-amber-600 text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors">
              Liên hệ ngay
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
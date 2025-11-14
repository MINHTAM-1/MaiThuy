const About = () => {
  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-10 h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
          />
        </svg>
      ),
      title: "Nguyên liệu chất lượng",
      description:
        "Sử dụng 100% hạt cà phê Arabica và Robusta cao cấp từ vùng nguyên liệu nổi tiếng",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-10 h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      ),
      title: "Rang xay tươi mỗi ngày",
      description:
        "Đảm bảo hương vị tươi ngon nhất đến tay khách hàng với quy trình rang xay công phu",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-10 h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      ),
      title: "Barista chuyên nghiệp",
      description:
        "Đội ngũ nhân viên được đào tạo bài bản, nhiệt tình và giàu kinh nghiệm",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-10 h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
          />
        </svg>
      ),
      title: "Giao hàng nhanh chóng",
      description:
        "Miễn phí giao hàng trong nội thành TP.HCM, đóng gói cẩn thận",
    },
  ];

  const milestones = [
    {
      year: "2018",
      event: "Thành lập MAITHUY COFFEE",
      description: "Bắt đầu với cửa hàng đầu tiên tại Quận 5",
    },
    {
      year: "2019",
      event: "Mở rộng sản phẩm",
      description: "Phát triển thêm 10 dòng sản phẩm mới",
    },
    {
      year: "2020",
      event: "Top 10 Thương hiệu",
      description: "Được vinh danh Top 10 thương hiệu cà phê được yêu thích",
    },
    {
      year: "2023",
      event: "10.000+ khách hàng",
      description: "Đạt mốc phục vụ hơn 10.000 khách hàng thân thiết",
    },
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
            Với hơn 5 năm kinh nghiệm trong ngành cà phê, chúng tôi tự hào mang
            đến những sản phẩm chất lượng nhất từ những hạt cà phê được tuyển
            chọn kỹ lưỡng
          </p>
        </div>

        {/* Story Section - Kết hợp cũ và mới */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Câu chuyện của chúng tôi
            </h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                <span className="font-semibold text-amber-600">
                  MAITHUY COFFEE
                </span>{" "}
                được thành lập năm 2018 với mong muốn mang đến cho khách hàng
                những ly cà phê chất lượng cao với hương vị đặc trưng, kết hợp
                giữa truyền thống và hiện đại.
              </p>
              <p>
                Chúng tôi tin rằng một ly cà phê ngon không chỉ đơn thuần là
                thức uống, mà còn là{" "}
                <span className="text-amber-600">trải nghiệm</span>, là{" "}
                <span className="text-amber-600">câu chuyện</span>, là{" "}
                <span className="text-amber-600">cảm xúc</span> được gửi gắm qua
                từng hạt cà phê.
              </p>
              <p>
                Từ những hạt cà phê được tuyển chọn kỹ lưỡng từ vùng nguyên liệu
                nổi tiếng, qua quy trình rang xay công phu, cho đến tay những
                barista tài năng - tất cả đều được chúng tôi chăm chút tỉ mỉ
                trong từng công đoạn.
              </p>
            </div>

            {/* Milestones Timeline */}
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Chặng đường phát triển
              </h3>
              <div className="space-y-3">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-3 bg-amber-50 rounded-lg"
                  >
                    <div className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold min-w-16 text-center">
                      {milestone.year}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {milestone.event}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Awards & Recognition */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-8 text-center shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 mx-auto mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
                />
              </svg>
              <h3 className="text-2xl font-bold mb-2">Top 10</h3>
              <p className="text-amber-100 text-lg">
                Thương hiệu cà phê được yêu thích nhất 2023
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-100 rounded-xl p-6 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 mx-auto mb-2 text-amber-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
                <h4 className="font-semibold text-gray-900">4.9/5</h4>
                <p className="text-sm text-gray-600">Đánh giá</p>
              </div>
              <div className="bg-amber-100 rounded-xl p-6 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 mx-auto mb-2 text-amber-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
                <h4 className="font-semibold text-gray-900">10K+</h4>
                <p className="text-sm text-gray-600">Khách hàng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Điểm nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 border border-amber-100"
              >
                <div className="text-amber-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-amber-50 rounded-2xl p-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-amber-600 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
              />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Sứ mệnh</h3>
            <p className="text-gray-700 leading-relaxed">
              Mang đến cho khách hàng những trải nghiệm cà phê tuyệt vời nhất
              thông qua chất lượng sản phẩm vượt trội, dịch vụ chuyên nghiệp và
              không gian thân thiện.
            </p>
          </div>
          <div className="bg-amber-900 text-white rounded-2xl p-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-amber-200 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <h3 className="text-2xl font-bold mb-4">Tầm nhìn</h3>
            <p className="text-amber-100 leading-relaxed">
              Trở thành thương hiệu cà phê hàng đầu Việt Nam, lan tỏa văn hóa cà
              phê chất lượng và góp phần nâng cao đời sống tinh thần của cộng
              đồng.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-amber-800 to-amber-600 text-white rounded-2xl p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">MAITHUY COFFEE trong số</h2>
            <p className="text-amber-200 text-lg">
              Những con số biết nói về hành trình của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-amber-200">
                5+
              </div>
              <p className="text-amber-100 font-semibold">Năm kinh nghiệm</p>
              <p className="text-amber-200 text-sm">Thành lập 2018</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-amber-200">
                10K+
              </div>
              <p className="text-amber-100 font-semibold">Khách hàng</p>
              <p className="text-amber-200 text-sm">Hài lòng</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-amber-200">
                50+
              </div>
              <p className="text-amber-100 font-semibold">Sản phẩm</p>
              <p className="text-amber-200 text-sm">Đa dạng</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-amber-200">
                99%
              </div>
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
              <div className="flex items-center justify-center space-x-1 text-2xl font-bold">
                <span>5</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-amber-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
              </div>
              <p className="text-amber-200 text-sm">Đánh giá trung bình</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Sẵn sàng khám phá hương vị?
          </h3>
          <p className="text-gray-600 mb-6">
            Trải nghiệm sự khác biệt từ MAITHUY COFFEE ngay hôm nay
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors shadow-lg">
              Xem sản phẩm
            </button>
            <button className="border-2 border-amber-600 text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors">
              Liên hệ ngay
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

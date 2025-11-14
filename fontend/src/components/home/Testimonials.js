import { useState, useEffect } from "react";

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Chị Nguyễn Thị Mai",
      role: "Khách hàng thân thiết",
      content:
        "Cà phê ở đây có hương vị rất đặc biệt, thơm ngon khác hẳn những nơi khác. Tôi đã mua ở đây được hơn 2 năm và không có ý định đổi chỗ nào khác.",
      rating: 5,
    },
    {
      id: 2,
      name: "Anh Trần Văn Nam",
      role: "Chủ quán cà phê",
      content:
        "Tôi sử dụng cà phê của MAITHUY COFFEE cho quán của mình đã được 1 năm. Chất lượng ổn định, khách hàng rất hài lòng về hương vị.",
      rating: 5,
    },
    {
      id: 3,
      name: "Chị Lê Thị Hương",
      role: "Nhân viên văn phòng",
      content:
        "Giao hàng nhanh, đóng gói cẩn thận. Cà phê rang xay mới nên rất thơm. Nhân viên tư vấn nhiệt tình, tôi rất hài lòng với dịch vụ.",
      rating: 4,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const renderStars = (rating) => {
    return (
      <div className="flex justify-center mb-4">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`${index < rating ? "text-amber-400" : "text-gray-300"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className="testimonials py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Những phản hồi chân thực từ khách hàng đã trải nghiệm sản phẩm của
            MAITHUY COFFEE
          </p>
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 relative">
            {/* Quote Icon */}
            <div className="absolute top-4 left-4 text-amber-200 text-6xl">
              "
            </div>

            {/* Testimonial Content */}
            <div className="text-center relative z-10">
              {renderStars(testimonials[currentTestimonial].rating)}

              <blockquote className="text-xl md:text-2xl text-gray-700 mb-8 italic">
                "{testimonials[currentTestimonial].content}"
              </blockquote>

              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-amber-800">
                    {testimonials[currentTestimonial].name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-gray-600">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentTestimonial
                      ? "bg-amber-600"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
          <div>
            <div className="text-3xl font-bold text-amber-600 mb-2">4.9/5</div>
            <p className="text-gray-600">Đánh giá trung bình</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-600 mb-2">2K+</div>
            <p className="text-gray-600">Đánh giá</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-600 mb-2">95%</div>
            <p className="text-gray-600">Khách hàng quay lại</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-600 mb-2">24/7</div>
            <p className="text-gray-600">Hỗ trợ khách hàng</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

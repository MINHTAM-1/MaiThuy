const About = () => {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image Section */}
          <div className="lg:w-1/2">
            <img
              src="/assets/about.jpg"
              alt="Về MAITHUY Coffee"
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          {/* Text Section */}
          <div className="lg:w-1/2 space-y-6">
            <div className="space-y-4">
              <h4 className="text-amber-600 font-semibold text-lg">
                Về chúng tôi
              </h4>
              <h1 className="text-4xl font-bold text-gray-900">
                MAITHUY COFFEE
              </h1>
              <p className="text-gray-600 leading-relaxed">
                MAITHUY Coffee được thành lập với mong muốn mang đến những ly cà phê
                nguyên chất, đậm đà hương vị và tràn đầy năng lượng. Chúng tôi
                luôn chọn lựa những hạt cà phê chất lượng cao, rang mới mỗi ngày,
                đảm bảo hương thơm tự nhiên và vị ngon trọn vẹn trong từng tách.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Cà phê hữu cơ</h3>
                <p className="text-gray-600 text-sm">
                  Sử dụng nguồn nguyên liệu sạch, canh tác tự nhiên, an toàn cho sức khỏe
                  và thân thiện với môi trường.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Rang mới mỗi ngày</h3>
                <p className="text-gray-600 text-sm">
                  Mỗi mẻ rang đều được thực hiện thủ công, đảm bảo độ tươi ngon
                  và hương vị nguyên bản của hạt cà phê.
                </p>
              </div>
            </div>

            <button className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200 mt-6">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

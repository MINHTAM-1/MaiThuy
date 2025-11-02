const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-900 to-amber-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Chào mừng đến với Cafe Delight</h1>
            <p className="text-xl mb-8 text-amber-100">
              Hương vị cafe tuyệt hảo - Không gian ấm cúng
            </p>
            <button className="bg-white text-amber-800 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-amber-50 transition-colors duration-200">
              Xem Thực Đơn
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Sản phẩm nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product cards sẽ được thêm sau */}
            <div className="text-center text-gray-500">
              Sản phẩm sẽ được hiển thị ở đây...
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-amber-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-amber-900 mb-6">Về Chúng Tôi</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              MaiThuyCaffee mang đến những hạt cafe chất lượng cao, được tuyển chọn kỹ lưỡng 
              và rang xay theo công thức đặc biệt. Không gian ấm cúng của chúng tôi là 
              điểm đến lý tưởng cho những cuộc hẹn hò và làm việc.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
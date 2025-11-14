import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <section id="banner" className="section-p1 text-white bg-gray-900 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left">
          <div className="mb-8">
            <h2 className="text-5xl md:text-7xl font-bold leading-tight tracking-wide">Coffee</h2>
            <h2 className="text-5xl md:text-7xl font-bold leading-tight tracking-wide text-amber-400">Moring</h2>
          </div>
          <p className="text-lg md:text-xl mb-12 text-gray-300 max-w-xl leading-relaxed">
            Thức dậy và cảm nhận hương cà phê! Hãy bắt đầu ngày mới thật sảng khoái 
            với một tách cà phê thơm ngon!
          </p>
          <div className="button-space flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Link to="/products">
              <button className="normal bg-amber-600 text-white px-10 py-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200 text-base md:text-lg">
                Đặt Hàng Ngay!
              </button>
            </Link>
            <button className="normal bg-transparent border-2 border-white text-white px-10 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors duration-200 text-base md:text-lg">
              Giảm 75%
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;

import { Link } from 'react-router-dom';
import ROUTES from '../../routes';
const Banner = () => {
  return (
    <section
      id="banner"
      className="bg-cover bg-center text-white py-20 h-"
      style={{
        backgroundImage: "url('/assets/banner.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left">
          <h2 className="text-7xl font-bold mb-4">MORNING COFFEE</h2>
          <p className="text-2xl mb-8 text-amber-100 max-w-2xl mx-left">
            Wake Up and Smell the Coffee! and Start Your Morning Right with a
            Cup of Delicious Coffee!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-left">
            <Link to={ROUTES.PRODUCTS}>
              <button className="bg-white text-amber-800 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors duration-200">
                Đặt Hàng Ngay !
              </button>
            </Link>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-800 transition-colors duration-200">
              Giảm 75%
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;

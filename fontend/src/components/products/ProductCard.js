import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import ROUTES from "../../routes";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, onAddToCart, addingToCart }) => {
  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
  const navigate = useNavigate();

  return (
    <div
      className="product bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => navigate(`${ROUTES.PRODUCTS}/${product._id}`)}
    >
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : 'https://res.cloudinary.com/dpuldllty/image/upload/v1736512130/default_tkzvsa.png'}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4">
        <div className="product-des space-y-2">
          <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 mr-2 py-1 rounded">
            {product.categoryId.name}
          </span>
          <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
            {product.typeId.name}
          </span>
          <p className="font-semibold text-gray-900">
            {product.code && `${product.code}: `}{product.name}
          </p>

          {/* Ratings */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, idx) => {
              const rating = product.ratingsAverage || 0;
              if (idx < Math.floor(rating)) return <FaStar key={idx} className="text-yellow-400" />;
              if (idx < rating) return <FaStarHalfAlt key={idx} className="text-yellow-400" />;
              return <FaRegStar key={idx} className="text-gray-300" />;
            })}
            <span className="text-gray-500 text-sm ml-1">({product.ratingsCount || 0})</span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2 mt-1">
            <h4 className="text-lg font-bold text-amber-600">
              {discountedPrice.toLocaleString("vi-VN")} VNĐ
            </h4>
            {product.discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                {product.price.toLocaleString("vi-VN")} VNĐ
              </span>
            )}
          </div>
        </div>

        <div className="mt-2 flex space-x-2">
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            disabled={addingToCart[product._id]}
            className="flex-1 bg-amber-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors text-sm"
          >
            {addingToCart[product._id] ? "Đang thêm..." : "Thêm vào giỏ"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

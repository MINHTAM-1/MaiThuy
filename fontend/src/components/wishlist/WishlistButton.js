import { Link } from 'react-router-dom';
import useWishlistStore from '../../store/wishlistStore';
import { useState } from 'react';

const WishlistButton = () => {
  const { getTotalItems } = useWishlistStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const totalItems = getTotalItems();

  return (
    <div className="relative">
      <Link 
        to="/wishlist" 
        className="relative p-2 text-gray-700 hover:text-red-600 transition-all duration-200 transform hover:scale-110"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className="text-2xl transition-transform duration-200 hover:scale-110">
          {totalItems > 0 ? '❤️' : '🤍'}
        </span>
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold animate-pulse">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </Link>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap z-50">
          {totalItems > 0 ? `${totalItems} sản phẩm yêu thích` : 'Danh sách yêu thích'}
          <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-800 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default WishlistButton;
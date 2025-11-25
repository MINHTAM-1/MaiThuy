import { Link } from 'react-router-dom';
import { useState } from 'react';
import ROUTES from '../../routes';
import { FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const CartButton = () => {
  const {cart} = useAuth();
  const [showTooltip, setShowTooltip] = useState(false);
  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="relative">
      <Link 
        to={ROUTES.CART}
        className="relative p-2 text-gray-700 hover:text-amber-800 transition-all duration-200 transform hover:scale-110"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className="text-2xl transition-transform duration-200 hover:scale-110"><FaShoppingCart/></span>
        {totalItems > 0 && (
          <span className="absolute top-6 left-4 bg-amber-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </Link>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap z-50">
          <div className="font-medium">
            {totalItems > 0 ? `${totalItems} sản phẩm` : 'Giỏ hàng trống'}
          </div>
          <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-800 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default CartButton;
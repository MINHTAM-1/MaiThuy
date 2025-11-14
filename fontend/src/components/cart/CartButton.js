import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import { useState } from 'react';

const CartButton = () => {
  const { getTotalItems, getTotalPrice } = useCartStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <div className="relative">
      <Link 
        to="/cart" 
        className="relative p-2 text-white hover:text-amber-300 transition-all duration-200 transform hover:scale-110"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Shopping Cart Icon from Heroicons */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-6 h-6"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" 
          />
        </svg>
        
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold animate-bounce">
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
          {totalItems > 0 && (
            <div className="text-amber-400 font-semibold">
              {totalPrice.toLocaleString('vi-VN')}₫
            </div>
          )}
          <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-800 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default CartButton;
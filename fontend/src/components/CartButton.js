import { Link } from 'react-router-dom';
import { useCart } from '../store/cartStore';

const CartButton = () => {
  const { items } = useCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link 
      to="/cart" 
      className="relative p-2 text-gray-700 hover:text-amber-800 transition-colors duration-200"
    >
      <span className="text-2xl">🛒</span>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-amber-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold">
          {itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartButton;
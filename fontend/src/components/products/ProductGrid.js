import { useState } from 'react';
import ProductCard from './ProductCard';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { cartAPI } from '../../services/api';

const ProductGrid = ({ products }) => {
  const [addingToCart, setAddingToCart] = useState({});
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast("Vui lòng đăng nhập để thêm sản phẩm", { icon: 'ℹ️' });
      return;
    }
    setAddingToCart(prev => ({ ...prev, [product._id]: true }));
    try {
      await cartAPI.addItem(product._id);
      toast.success("Đã thêm sản phẩm vào giỏ!");
    } catch (err) {
      toast.error("Lỗi khi thêm sản phẩm: " + (err.response?.data?.message || 'Lỗi'));
    } finally {
      setAddingToCart(prev => ({ ...prev, [product._id]: false }));
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😔</div>
        <p className="text-gray-500 text-lg mb-4">Không tìm thấy sản phẩm phù hợp.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onAddToCart={handleAddToCart}
          addingToCart={addingToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;

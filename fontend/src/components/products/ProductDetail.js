import { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt, FaAngleRight, FaAngleLeft } from "react-icons/fa";
import ReviewSection from '../reviews/ReviewSection';
import toast from "react-hot-toast";
import { cartAPI, productsAPI } from '../../services/api';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState({});
  const { isAuthenticated, setCartContext } = useAuth();

  useEffect(() => {
    const getProductDetail = async () => {
      try {
        const res = await productsAPI.getById(id);
        setProduct(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Lỗi khi tải chi tiết sản phẩm");
      }
    };
    getProductDetail();
  }, [id]);

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast("Vui lòng đăng nhập để thêm sản phẩm", { icon: 'ℹ️' });
      return;
    }
    setAddingToCart(prev => ({ ...prev, [product._id]: true }));
    try {
      await cartAPI.addItem(product._id);
      const resCart = await cartAPI.get();
      setCartContext(resCart.data.data);
      toast.success("Đã thêm sản phẩm vào giỏ!");
    } catch (err) {
      toast.error("Lỗi khi thêm sản phẩm: " + (err.response?.data?.message || 'Lỗi'));
    } finally {
      setAddingToCart(prev => ({ ...prev, [product._id]: false }));
    }
  };

  if (!product) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">Đang tải...</div>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);

  const handlePrevImage = () => {
    setCurrentImage(prev => (prev === 0 ? product.images.length - 1 : prev - 1));
  };
  const handleNextImage = () => {
    setCurrentImage(prev => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen py-12 px-4 lg:px-16 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 lg:p-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-10">
          
          {/* LEFT - IMAGE SLIDER */}
          <div className="relative bg-gray-100 py-5 rounded-lg flex flex-col items-center justify-center">
            <img
              src={product.images[currentImage]}
              alt={product.name}
              className="h-96 w-full object-contain rounded-lg"
            />

            {/* Arrows */}
            {product.images.length > 1 && (
              <>
                <button onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full">
                  <FaAngleLeft />
                </button>
                <button onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full">
                  <FaAngleRight />
                </button>
              </>
            )}

            {/* Thumbnails */}
            <div className="flex mt-4 space-x-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  className={`h-16 w-16 rounded cursor-pointer object-cover border 
                    ${idx === currentImage ? "border-amber-600" : "border-gray-300"}`}
                  onClick={() => setCurrentImage(idx)}
                />
              ))}
            </div>
          </div>

          {/* RIGHT - INFO */}
          <div className="flex flex-col mt-6 lg:mt-0 gap-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">{product.name}</h1>

              <div className="flex items-center space-x-2 mt-2">
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm">
                  {product.categoryId?.name}
                </span>
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm">
                  {product.typeId?.name}
                </span>
              </div>

              {/* Ratings */}
              <div className="flex items-center mt-2 space-x-1">
                {[...Array(5)].map((_, idx) => {
                  const rating = product.ratingsAverage || 0;
                  if (idx < Math.floor(rating)) return <FaStar key={idx} className="text-yellow-400" />;
                  if (idx < rating) return <FaStarHalfAlt key={idx} className="text-yellow-400" />;
                  return <FaRegStar key={idx} className="text-gray-300" />;
                })}
                <span className="text-gray-500 text-sm ml-2">({product.ratingsCount || 0})</span>
              </div>

              <p className="mt-4 text-gray-700">{product.description}</p>

              {/* PRICE */}
              <div className="flex items-center space-x-4 mt-4">
                <p className="text-2xl font-bold text-amber-600">
                  {discountedPrice.toLocaleString("vi-VN")}₫
                </p>
                {product.discount > 0 && (
                  <p className="text-lg text-gray-500 line-through">
                    {product.price.toLocaleString("vi-VN")}₫
                  </p>
                )}
              </div>

              <p className="text-sm mt-2">Tồn kho: <b>{product.stock}</b></p>
            </div>

            {/* BUTTONS */}
            
              <button
                onClick={() => handleAddToCart(product)}
                disabled={addingToCart[product._id]}
                className="bg-amber-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors">
                {addingToCart[product._id] ? "Đang thêm..." : "Thêm vào giỏ"}
              </button>
            

            {/* ADDITIONAL INFO */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Thông tin sản phẩm</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Danh mục:</strong> {product.categoryId.name}</p>
                <p><strong>Loại:</strong> {product.type}</p>
                <p><strong>Trọng lượng:</strong> {product.weight}</p>
                <p><strong>Xuất xứ:</strong> {product.origin}</p>
                {product.tags && product.tags.length > 0 && (
                  <p><strong>Tags:</strong> {product.tags.join(", ")}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="mt-12">
          <ReviewSection product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

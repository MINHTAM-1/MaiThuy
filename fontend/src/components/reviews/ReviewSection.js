import { useState, useEffect, useCallback } from 'react';
import { reviewsAPI } from '../../services/api';

const ReviewSection = ({ product }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await reviewsAPI.getByProduct(product._id);
      const reviewsData = response.data.data.items;
      setReviews(reviewsData);
    } catch (err) {
      console.error('❌ Fetch reviews error:', err);
      setError('Lỗi khi tải đánh giá');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [product._id]);

  useEffect(() => {
    if (product._id) {
      fetchReviews();
    }
  }, [product._id, fetchReviews]);

  // Tính phân phối rating - AN TOÀN
  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviews.forEach(review => {
      const rating = review?.rating;
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++;
      }
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  if (loading) {
    return (
      <div className="mt-8 p-4 border-t">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Đánh giá sản phẩm</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Đánh giá sản phẩm</h3>

      {/* Thông báo lỗi */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Rating Summary - Chỉ hiển thị nếu có reviews */}
      {product.ratingsCount > 0 && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{product.ratingAverage}</div>
              <div className="text-yellow-400 text-lg">
                {'★'.repeat(Math.round(parseFloat(product.ratingAverage)))}
                {'☆'.repeat(5 - Math.round(parseFloat(product.ratingAverage)))}
              </div>
              <div className="text-gray-600 text-sm mt-1">{product.ratingsCount} đánh giá</div>
            </div>

            <div className="flex-1 max-w-xs">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center text-sm mb-1">
                  <span className="w-8 text-gray-600">{rating} ★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{
                        width: product.ratingsCount > 0 ? `${(ratingDistribution[rating] / product.ratingsCount) * 100}%` : '0%'
                      }}
                    ></div>
                  </div>
                  <span className="w-8 text-gray-600 text-right">
                    {ratingDistribution[rating]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {product.ratingsCount === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">💬</div>
            <p>Chưa có đánh giá nào cho sản phẩm này.</p>
            <p className="text-sm">Hãy là người đầu tiên đánh giá!</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review._id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-gray-900">
                    {review.userId.name || 'Ẩn danh'}
                  </div>
                  <div className="text-yellow-400 text-sm">
                    {'★'.repeat(review.rating || 0)}{'☆'.repeat(5 - (review.rating || 0))}
                  </div>
                </div>
                <div className="text-gray-500 text-sm">
                  {review.updatedAt
                    ? `Chỉnh sửa lúc: ${new Date(review.updatedAt).toLocaleString('vi-VN')}`
                    : review.createdAt
                      ? new Date(review.createdAt).toLocaleString('vi-VN')
                      : 'Không xác định'}
                </div>

              </div>

              <p className="text-gray-600 text-sm">{review.comment}</p>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
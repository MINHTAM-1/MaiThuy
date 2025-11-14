import { useState, useEffect, useCallback } from 'react';
import { reviewsAPI } from '../../services/api';

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await reviewsAPI.getByProduct(productId);
      console.log('🔍 REVIEWS API RESPONSE:', response);
      
      let reviewsData = [];
      
      // Xử lý nhiều định dạng API response
      if (Array.isArray(response.data)) {
        reviewsData = response.data;
      } else if (Array.isArray(response.data?.data)) {
        reviewsData = response.data.data;
      } else if (response.data?.data) {
        reviewsData = [response.data.data];
      } else if (Array.isArray(response.data?.reviews)) {
        reviewsData = response.data.reviews;
      } else {
        reviewsData = [];
      }

      console.log('Final reviews to render:', reviewsData);
      setReviews(reviewsData);
      
    } catch (err) {
      console.error('Fetch reviews error:', err);
      setError('Lỗi khi tải đánh giá');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, fetchReviews]);

  // Tính phân phối rating - AN TOÀN
  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    if (Array.isArray(reviews)) {
      reviews.forEach(review => {
        const rating = review?.rating;
        if (rating >= 1 && rating <= 5) {
          distribution[rating]++;
        }
      });
    }
    
    return distribution;
  };

  // Tính rating trung bình - AN TOÀN
  const getAverageRating = () => {
    if (!Array.isArray(reviews) || reviews.length === 0) return 0;
    
    const validReviews = reviews.filter(review => review?.rating);
    if (validReviews.length === 0) return 0;
    
    const total = validReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / validReviews.length).toFixed(1);
  };

  const ratingDistribution = getRatingDistribution();
  const averageRating = getAverageRating();
  const totalReviews = Array.isArray(reviews) ? reviews.length : 0;

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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Rating Summary - Chỉ hiển thị nếu có reviews */}
      {totalReviews > 0 && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{averageRating}</div>
              <div className="text-yellow-400 text-lg">
                {'★'.repeat(Math.round(parseFloat(averageRating)))}
                {'☆'.repeat(5 - Math.round(parseFloat(averageRating)))}
              </div>
              <div className="text-gray-600 text-sm mt-1 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {totalReviews} đánh giá
              </div>
            </div>
            
            <div className="flex-1 max-w-xs">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center text-sm mb-1">
                  <span className="w-8 text-gray-600">{rating} ★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full" 
                      style={{ 
                        width: totalReviews > 0 ? `${(ratingDistribution[rating] / totalReviews) * 100}%` : '0%' 
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
        {totalReviews === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>Chưa có đánh giá nào cho sản phẩm này.</p>
            <p className="text-sm">Hãy là người đầu tiên đánh giá!</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review._id || review.id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-gray-900 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {review.userName || review.username || 'Ẩn danh'}
                  </div>
                  <div className="text-yellow-400 text-sm">
                    {'★'.repeat(review.rating || 0)}{'☆'.repeat(5 - (review.rating || 0))}
                  </div>
                </div>
                <div className="text-gray-500 text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : 'Không xác định'}
                </div>
              </div>
              
              {review.title && (
                <div className="font-medium text-gray-900 mb-1">{review.title}</div>
              )}
              
              <p className="text-gray-600 text-sm">{review.comment || review.content}</p>
              
              {review.verifiedPurchase && (
                <div className="inline-flex items-center text-green-600 text-xs mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Đã mua hàng</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Write Review Button - Tạm ẩn vì chưa có auth */}
      {/* {user && (
        <div className="mt-6">
          <button className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Viết đánh giá
          </button>
        </div>
      )} */}
    </div>
  );
};

export default ReviewSection;
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useReviewStore = create(
  persist(
    (set, get) => ({
      reviews: [],
      
      // Thêm review mới
      addReview: (review) => set((state) => ({
        reviews: [...state.reviews, { 
          ...review, 
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          helpful: 0
        }]
      })),
      
      // Lấy reviews theo productId
      getReviewsByProduct: (productId) => {
        const state = get();
        return state.reviews
          .filter(review => review.productId === productId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      },
      
      // Tính rating trung bình
      getAverageRating: (productId) => {
        const state = get();
        const productReviews = state.reviews.filter(review => review.productId === productId);
        if (productReviews.length === 0) return 0;
        
        const total = productReviews.reduce((sum, review) => sum + review.rating, 0);
        return (total / productReviews.length).toFixed(1);
      },
      
      // Đánh dấu review hữu ích
      markHelpful: (reviewId) => set((state) => ({
        reviews: state.reviews.map(review =>
          review.id === reviewId 
            ? { ...review, helpful: review.helpful + 1 }
            : review
        )
      })),
      
      // Xóa review (admin function)
      deleteReview: (reviewId) => set((state) => ({
        reviews: state.reviews.filter(review => review.id !== reviewId)
      }))
    }),
    {
      name: 'reviews-storage',
    }
  )
);

export default useReviewStore;
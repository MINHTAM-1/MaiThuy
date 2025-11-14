// src/api/index.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Tạo instance axios với cấu hình chuẩn
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - thêm token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - xử lý lỗi tập trung
// Trong file api/index.js - sửa response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { status, data } = error.response || {};
    
    console.error('🔴 API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: status,
      data: data, // ← Sẽ hiển thị chi tiết lỗi từ backend
      message: error.message
    });
    
    switch (status) {
      case 400:
        console.error('🔴 Bad Request - Server says:', data);
        break;
      case 401:
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        break;
      case 403:
        console.warn('Truy cập bị từ chối:', data?.message);
        break;
      case 404:
        console.warn('Không tìm thấy tài nguyên:', data?.message);
        break;
      case 500:
        console.error('Lỗi server:', data?.message);
        break;
      default:
        console.error('Lỗi không xác định:', error.message);
    }
    
    return Promise.reject(error.response?.data || error);
  }
);

// API endpoints với cấu trúc thống nhất
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
};

export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
  getStats: () => api.get('/users/stats'),
  getOrderHistory: (params = {}) => api.get('/users/orders', { params }),
};

export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  search: (query, params = {}) => api.get('/products/search', { params: { q: query, ...params } }),
  getByCategory: (category, params = {}) => api.get(`/products/category/${category}`, { params }),
  getFeatured: (limit = 8) => api.get('/products/featured', { params: { limit } }),
  getCategories: () => api.get('/products/categories'),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
};

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId, quantity = 1) => api.post('/cart/add', { productId, quantity }),
  update: (productId, quantity) => api.put(`/cart/update/${productId}`, { quantity }),
  remove: (productId) => api.delete(`/cart/remove/${productId}`),
  clear: () => api.delete('/cart/clear'),
};

export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getAll: (params = {}) => api.get('/orders', { params }),
  getById: (orderId) => api.get(`/orders/${orderId}`),
  getUserOrders: (params = {}) => api.get('/users/orders', { params }),
  cancel: (orderId) => api.put(`/orders/${orderId}/cancel`),
};

export const reviewsAPI = {
  create: (reviewData) => api.post('/reviews', reviewData),
  getByProduct: (productId, params = {}) => api.get(`/reviews/product/${productId}`, { params }),
  getStats: (productId) => api.get(`/reviews/product/${productId}/stats`),
  getUserReviews: (params = {}) => api.get('/reviews/my-reviews', { params }),
  markHelpful: (reviewId) => api.put(`/reviews/${reviewId}/helpful`),
  update: (reviewId, updateData) => api.put(`/reviews/${reviewId}`, updateData),
  delete: (reviewId) => api.delete(`/reviews/${reviewId}`),
};

export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getRevenueStats: (params = {}) => api.get('/admin/dashboard/revenue', { params }),
  getTopProducts: (params = {}) => api.get('/admin/dashboard/top-products', { params }),
  getUserStats: () => api.get('/admin/dashboard/user-stats'),
  
  // Orders
  getAllOrders: (params = {}) => api.get('/admin/orders', { params }),
  updateOrderStatus: (orderId, status) => api.put(`/admin/orders/${orderId}/status`, { status }),
  updatePaymentStatus: (orderId, paymentStatus) => api.put(`/admin/orders/${orderId}/payment-status`, { paymentStatus }),
  
  // Reviews
  getAllReviews: (params = {}) => api.get('/admin/reviews', { params }),
  deleteReview: (reviewId) => api.delete(`/admin/reviews/${reviewId}`),
  getReviewStats: () => api.get('/admin/reviews/stats'),
};

export default api;
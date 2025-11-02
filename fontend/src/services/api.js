import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Tạo instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor để thêm token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn, đăng xuất
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/profile"),
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  search: (query, params = {}) =>
    api.get("/products/search", { params: { q: query, ...params } }),
  getByCategory: (category, params = {}) =>
    api.get(`/products/category/${category}`, { params }),
  getFeatured: (limit = 8) =>
    api.get("/products/featured", { params: { limit } }),
  getCategories: () => api.get("/products/categories"),
  create: (productData) => api.post("/products", productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
};

// Cart API
export const cartAPI = {
  get: () => api.get("/cart"),
  add: (productId, quantity = 1) =>
    api.post("/cart/add", { productId, quantity }),
  update: (productId, quantity) =>
    api.put(`/cart/update/${productId}`, { quantity }),
  remove: (productId) => api.delete(`/cart/remove/${productId}`),
  clear: () => api.delete("/cart/clear"),
};

// Orders API
export const ordersAPI = {
  create: (orderData) => api.post("/orders", orderData),
  getAll: (params = {}) => api.get("/orders", { params }),
  getById: (orderId) => api.get(`/orders/${orderId}`),
  cancel: (orderId) => api.put(`/orders/${orderId}/cancel`),
};

// Reviews API
export const reviewsAPI = {
  create: (reviewData) => api.post("/reviews", reviewData),
  getByProduct: (productId, params = {}) =>
    api.get(`/reviews/product/${productId}`, { params }),
  getStats: (productId) => api.get(`/reviews/product/${productId}/stats`),
  getUserReviews: (params = {}) => api.get("/reviews/my-reviews", { params }),
  markHelpful: (reviewId) => api.put(`/reviews/${reviewId}/helpful`),
  update: (reviewId, updateData) => api.put(`/reviews/${reviewId}`, updateData),
  delete: (reviewId) => api.delete(`/reviews/${reviewId}`),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (profileData) => api.put("/users/profile", profileData),
  changePassword: (passwordData) =>
    api.put("/users/change-password", passwordData),
  getStats: () => api.get("/users/stats"),
  getOrderHistory: (params = {}) => api.get("/users/orders", { params }),
};

// Admin API
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get("/admin/dashboard/stats"),
  getRevenueStats: (params = {}) =>
    api.get("/admin/dashboard/revenue", { params }),
  getTopProducts: (params = {}) =>
    api.get("/admin/dashboard/top-products", { params }),
  getUserStats: () => api.get("/admin/dashboard/user-stats"),

  // Orders
  getAllOrders: (params = {}) => api.get("/admin/orders", { params }),
  updateOrderStatus: (orderId, status) =>
    api.put(`/admin/orders/${orderId}/status`, { status }),
  updatePaymentStatus: (orderId, paymentStatus) =>
    api.put(`/admin/orders/${orderId}/payment-status`, { paymentStatus }),

  // Reviews
  getAllReviews: (params = {}) => api.get("/admin/reviews", { params }),
  deleteReview: (reviewId) => api.delete(`/admin/reviews/${reviewId}`),
  getReviewStats: () => api.get("/admin/reviews/stats"),
};

export default api;

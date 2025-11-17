import axios from "axios";
import ResetPassword from "../pages/auth/ResetPassword";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9001";

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
  forgotPassword: (email) => api.post("/auth/forgot-password", email),
  validateResetCode: (payload) => api.post("/auth/validate-reset-code", payload),
  resetPassword: (payload) => api.post("/auth/reset-password", payload)
};

// Categories API
export const categoryAPI = {
  getAll: () => api.get("/categories"),
  getById: (id) => api.get(`/categories/${id}`),
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategoryId: (categoryId, params = {}) => api.get(`/products/category/${categoryId}`, { params }),
};

// Cart API
export const cartAPI = {
  get: () => api.get("/cart"),
  addItem: (productId) => api.post("/cart", {productId, quantity: 1}),
  updateItem: (productId, quantity) => api.patch("/cart", {item :{ productId, quantity }}),
  clear: () => api.delete("/cart/clear"),
};

export const promotionsAPI = {
  getAll: () => api.get("/promotions"),
  getById: (id) => api.get(`/promotions/${id}`),
  checkValidate: (code, orderValue) => api.post("/promotions/validate", {code, orderValue}),
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get("/orders"),
  getById: (orderId) => api.get(`/orders/${orderId}`),
  create: (orderData) => api.post("/orders", orderData),
  cancel: (orderId) => api.patch(`/orders/${orderId}/cancel`),
};

export const paymentAPI = {
  vnpay: (amount, orderId) => api.post("/payment/vnpay", {amount, orderId}),
  momo: (amount, orderId) => api.post("/payment/momo", {amount, orderId}),
};

// Reviews API
export const reviewsAPI = {
  create: (data) => api.post("/reviews", data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  getByOrder: (orderId) => api.get(`/reviews/order/${orderId}`),
  getByProduct: (productId) => api.get(`/reviews-by-product/${productId}`),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (profileData) => api.put("/users/profile", profileData),
  changePassword: (data) => api.put("/users/change-password", data),
};

export const contactAPI = {
  create: (data) => api.post("/contact", data),
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

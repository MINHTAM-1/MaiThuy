import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9002";

// Tạo instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
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
  forgotPassword: (email) => api.post("/auth/forgot-password", email),
  validateResetCode: (payload) => api.post("/auth/validate-reset-code", payload),
  resetPassword: (payload) => api.post("/auth/reset-password", payload)
};

// Categories API
export const categoriesAPI = {
  getAll: (params = {}) => api.get("/categories", { params }),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Types API
export const typesAPI = {
  getAll: (params = {}) => api.get("/types", { params }),
  getById: (id) => api.get(`/types/${id}`),
  create: (data) => api.post("/types", data),
  update: (id, data) => api.put(`/types/${id}`, data),
  delete: (id) => api.delete(`/types/${id}`),
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Promotions API
export const promotionsAPI = {
  getAll: (params = {}) => api.get("/promotions", { params }),
  getById: (id) => api.get(`/promotions/${id}`),
  create: (data) => api.post("/promotions", data),
  update: (id, data) => api.put(`/promotions/${id}`, data),
  delete: (id) => api.delete(`/promotions/${id}`),
};

// Orders API
export const ordersAPI = {
  getAll: (params = {}) => api.get("/orders", { params }),
  getById: (orderId) => api.get(`/orders/${orderId}`),
  update: (id, data) => api.patch(`/orders/${id}`, data),
};

// Payments API
export const paymentsAPI = {
  getAll: (params = {}) => api.get("/payments", { params }),
  getById: (paymentId) => api.get(`/payments/${paymentId}`),
  update: (id, data) => api.patch(`/payments/${id}`, data),
  refundMomo: (paymentId) => api.post("/payments/refund-momo", { paymentId })
};

// Reviews API
export const reviewsAPI = {
  getAll: (params = {}) => api.get("/reviews", { params }),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get("/users/profile")
};

export const contactsAPI = {
  getAll: (params = {}) => api.get("/contact", { params }),
  update: (id, data) => api.patch(`/contact/${id}/state`, data),
};

export default api;

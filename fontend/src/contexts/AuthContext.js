import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { authAPI, usersAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  }, []);

  // Function để lấy profile user
  const getUserProfile = useCallback(async () => {
    try {
      const response = await usersAPI.getProfile();

      // Xử lý nhiều structure response khác nhau
      let userData;

      if (response?.data?.user) {
        userData = response.data.user;
      } else if (response?.data) {
        userData = response.data;
      } else if (response?.user) {
        userData = response.user;
      } else if (response) {
        userData = response;
      }

      if (userData) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        // Fallback to localStorage
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
          } catch (e) {
            console.error("Error parsing saved user:", e);
          }
        }
      }
    } catch (error) {
      console.error("Get profile error:", error);
      if (error.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Check auth khi component mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken) {
        await getUserProfile();
      } else if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (e) {
          console.error("Error parsing saved user:", e);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token, getUserProfile]);

  // Login function - ĐÃ SỬA
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });

      // Extract token và user từ response (đã được axios interceptor xử lý)
      const token = response?.data?.token || response?.token;
      const userData = response?.data?.user || response?.user;

      if (!token || !userData) {
        return {
          success: false,
          message: "Thiếu dữ liệu đăng nhập từ server",
        };
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setToken(token);
      setUser(userData);

      return {
        success: true,
        data: response,
        user: userData,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message ||
          error.response?.data?.message ||
          "Đăng nhập thất bại",
      };
    }
  };

  // Trong function register của AuthContext.js
  const register = async (userData) => {
    try {
      console.log("📝 Register data being sent:", userData);

      const response = await authAPI.register(userData);
      console.log("✅ Register response:", response);

      const token = response?.data?.token || response?.token;
      const newUser = response?.data?.user || response?.user;

      if (!token || !newUser) {
        return {
          success: false,
          message: "Thiếu dữ liệu đăng ký từ server",
        };
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(newUser));
      setToken(token);
      setUser(newUser);

      return {
        success: true,
        data: response,
        user: newUser,
      };
    } catch (error) {
      console.error("❌ Register error details:", {
        message: error.message,
        status: error.status,
        data: error.data,
        fullError: error,
      });

      return {
        success: false,
        message: error.data?.message || error.message || "Đăng ký thất bại",
      };
    }
  };
  // Update profile function - ĐÃ SỬA
  const updateProfile = async (profileData) => {
    try {
      const response = await usersAPI.updateProfile(profileData);

      const updatedUser =
        response?.data?.user || response?.user || response?.data;

      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      return {
        success: true,
        data: response,
        user: updatedUser,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || error.response?.data?.message || "Cập nhật thất bại",
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

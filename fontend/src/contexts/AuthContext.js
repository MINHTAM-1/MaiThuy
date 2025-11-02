import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authAPI, usersAPI } from '../services/api'; // SỬA: '../services/api'

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  console.log('🔐 AuthContext State:', { 
    token: token ? 'exists' : 'null', 
    user, 
    loading 
  });

  // Logout function
  const logout = useCallback(() => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    
    // Sử dụng window.location thay vì useNavigate
    window.location.href = '/login';
  }, []);

  // Function để lấy profile user
  const getUserProfile = useCallback(async () => {
    try {
      console.log('🔄 Getting user profile...');
      const response = await usersAPI.getProfile();
      console.log('✅ Profile response:', response.data);
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else if (response.data && response.data.data) {
        setUser(response.data.data.user || response.data.data);
        localStorage.setItem('user', JSON.stringify(response.data.data.user || response.data.data));
      } else {
        console.error('❌ No user data in response');
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
          } catch (e) {
            console.error('Error parsing saved user:', e);
          }
        }
      }
    } catch (error) {
      console.error('❌ Get profile error:', error);
      console.error('Error details:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data
      });
      
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Check auth khi component mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 Checking authentication...');
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      console.log('📦 Saved data:', { 
        token: savedToken ? 'exists' : 'null', 
        user: savedUser ? 'exists' : 'null' 
      });

      if (savedToken) {
        await getUserProfile();
      } else if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          console.log('👤 Using saved user:', parsedUser);
          setUser(parsedUser);
        } catch (e) {
          console.error('❌ Error parsing saved user:', e);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token, getUserProfile]);

  // Login function
  const login = async (email, password) => {
    try {
      console.log('🚀 Attempting login with:', { email });
      const response = await authAPI.login({ email, password });
      console.log('✅ Login response:', response.data);
      
      const { token: newToken, user: userData } = response.data;
      
      if (!newToken || !userData) {
        console.error('❌ Missing token or user data in response');
        return { 
          success: false, 
          message: 'Thiếu dữ liệu đăng nhập' 
        };
      }

      console.log('👤 User role:', userData.role);
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(newToken);
      setUser(userData);
      
      console.log('✅ Login successful, state updated');
      
      return { 
        success: true, 
        data: response.data,
        user: userData 
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('Error response:', error.response?.data);
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng nhập thất bại' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng ký thất bại' 
      };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await usersAPI.updateProfile(profileData);
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Cập nhật thất bại' 
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
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
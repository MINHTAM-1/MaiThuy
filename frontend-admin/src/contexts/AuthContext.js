import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { usersAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../routes';

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
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate(ROUTES.LOGIN);
    console.log('🚪 User logged out');
  }, [navigate]);

  const getUserProfile = useCallback(async () => {
    try {
      const res = await usersAPI.getProfile();
      if (res.data?.data) {
        setUser(res.data.data);
      }
    } catch (error) {
      console.error('Get profile error:', error.response?.data?.message);
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      getUserProfile();
    }
    console.log("🔑 AuthProvider token:", savedToken ? "✓" : "✗");
  }, [getUserProfile, token]);

  const value = {
    user,
    logout,
    token,  
    setToken,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

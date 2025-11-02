import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute Debug:', {
    path: location.pathname,
    isAuthenticated,
    isAdmin,
    adminOnly,
    userRole: user?.role,
    loading
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🔐 Redirecting to login - Not authenticated');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    console.warn('🚫 Access denied - Admin required');
    console.log('Current user role:', user?.role);
    console.log('Required: admin, Current:', user?.role);
    return <Navigate to="/" replace />;
  }

  console.log('✅ Access granted to:', location.pathname);
  return children;
};

export default ProtectedRoute;
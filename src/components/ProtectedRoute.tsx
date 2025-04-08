import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresAdmin = false 
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // If authentication is still loading, display a spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lavender-600"></div>
      </div>
    );
  }

  // Check if the user has permission to access this route
  if (!isAuthenticated) {
    // If not logged in, redirect to login page
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  // If the route requires admin rights but the user is not an admin
  if (requiresAdmin && !isAdmin) {
    // Redirect to homepage or show an error message
    return <Navigate to="/" replace />;
  }

  // If the user has the necessary permissions, show the content
  return <>{children}</>;
};

export default ProtectedRoute; 
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/user" replace />;
  }

  return children;
};

export default ProtectedRoute;

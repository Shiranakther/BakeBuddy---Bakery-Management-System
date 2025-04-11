import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  let role = null;

  // If there's a token, try to decode it
  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      role = decodedToken.role; // Extract role from token
    } catch (error) {
      console.error('Error decoding token:', error);
      // Optionally clear invalid token and redirect to login
      localStorage.removeItem('token');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // If no token (not authenticated), redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but role doesn't match allowedRoles (and allowedRoles is specified), redirect to unauthorized
  if (allowedRoles.length > 0 && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // If authenticated and role is valid (or no role restriction), render children
  return children;
};

export default PrivateRoute;
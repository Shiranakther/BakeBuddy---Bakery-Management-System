import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  let role = null;

  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
      role = decodedToken.role;
    } catch (error) {
      console.error('Error decoding token', error);
    }
  }

  if (!role || !allowedRoles.includes(role)) {
    // Redirect to Unauthorized page
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
 
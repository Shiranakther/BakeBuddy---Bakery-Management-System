import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  // If user is authenticated, redirect to /home
  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      const role = decodedToken.role;
      // Optionally check token expiration if included in your JWT
      const exp = decodedToken.exp * 1000; // Convert to milliseconds
      if (Date.now() > exp) {
        localStorage.removeItem('token');
        return children; // Token expired, allow access to login/register
      }
      // If token is valid, redirect to home
      return <Navigate to="/home" state={{ from: location }} replace />;
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem('token'); // Clear invalid token
      return children; // Allow access to login/register if token is invalid
    }
  }

  // If no token, allow access to the public route
  return children;
};

export default PublicRoute;
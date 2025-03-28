import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // Import react-hot-toast
import '../../css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      

      
      // Show success toast
      toast.success('Login successful! Redirecting...', {
        duration: 2000, // Show for 2 seconds
      });

      // Redirect user based on role after a short delay
      setTimeout(() => {
        if (response.data.role === 'admin') {
          navigate('/'); // Adjust to your admin dashboard route if different
        } else {
          navigate('/'); // Adjust to your supervisor dashboard route if different
        }
      }, 500);
    } catch (err) {
      // Show error toast
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left-panel">
        <div className="login-logo">BakeBuddy</div>
      </div>
      <div className="login-right-panel">
        <div className="login-container">
          <h2 className="login-title">SIGN IN</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label className="login-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-input"
              />
            </div>
            <div className="login-form-group">
              <label className="login-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
              />
            </div>
            <button type="submit" className="login-submit-button">
              SIGN IN
            </button>
          </form>
          <p className="login-register-link">
            Don’t have an account?{' '}
            <Link to="/register" className="login-signup-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000, // Default duration
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            style: {
              background: "#4CAF50",
            },
          },
          error: {
            style: {
              background: "#f44336",
            },
          },
        }}
      />
    </div>
  );
};

export default Login;
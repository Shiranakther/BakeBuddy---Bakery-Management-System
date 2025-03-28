import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // Import react-hot-toast
import '../../css/Register.css';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('supervisor');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        firstName,
        lastName,
        companyName,
        email,
        phoneNumber,
        address,
        password,
        role,
      });

      // Store token and show success toast
      localStorage.setItem('token', response.data.token);
      toast.success('Registration successful! Redirecting to login...', {
        duration: 2000, // Show for 2 seconds
      });
      
      // Redirect to login after a short delay to allow the toast to be seen
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      // Show error toast with the server message or a default one
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-page">
      <div className="register-left-panel">
        <div className="register-logo">BakeBuddy</div>
      </div>
      <div className="register-right-panel">
        <div className="register-container">
          <h2 className="register-title">SIGN UP</h2>
          <form onSubmit={handleSubmit} className="register-form">
            <div className="register-form-group">
              <label className="register-label">First name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="register-input"
              />
            </div>
            <div className="register-form-group">
              <label className="register-label">Last name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="register-input"
              />
            </div>
            <div className="register-form-group">
              <label className="register-label">Company name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="register-input"
              />
            </div>
            <div className="register-form-group">
              <label className="register-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="register-input"
              />
            </div>
            <div className="register-form-group">
              <label className="register-label">Phone number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="register-input"
              />
            </div>
            <div className="register-form-group">
              <label className="register-label">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="register-input"
              />
            </div>
            <div className="register-form-group">
              <label className="register-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="register-input"
              />
            </div>
            <div className="register-form-group">
              <label className="register-label">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="register-select"
              >
                <option value="supervisor">Supervisor</option>
                {/* <option value="admin">Admin</option> */}
              </select>
            </div>
            <button type="submit" className="register-submit-button">
              REGISTER
            </button>
          </form>
          <p className="register-login-link">
            Do you have an account?{' '}
            <Link to="/login" className="register-signin-link">
              Sign In
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

export default Register;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FaUserCircle } from 'react-icons/fa';
import '../../css/ProfileUser.css';

const ProfileUser = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    companyName: '', // Added companyName to state
    email: '',
    phoneNumber: '',
    address: '',
    role: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const role = response.data.role?.toLowerCase() || 'unknown';
        setUser({
          firstName: response.data.firstName || 'N/A',
          lastName: response.data.lastName || 'N/A',
          companyName: response.data.companyName || 'N/A', // Added companyName
          email: response.data.email || 'N/A',
          phoneNumber: response.data.phoneNumber || 'N/A',
          address: response.data.address || 'N/A',
          role: role,
        });
      } catch (err) {
        console.error('Failed to fetch user data:', err.response?.data || err.message);
        if (err.response?.status === 401 || err.response?.status === 404) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully', {
      duration: 2000,
    });
    setTimeout(() => navigate('/login'), 2000);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.removeItem('token');
        toast.success('Profile deleted successfully', {
          duration: 2000,
        });
        setTimeout(() => navigate('/login'), 500);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete profile');
      }
    }
  };

  const displayRole = user.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : 'N/A';

  return (
    <div className="user-profile-page">
      <div className="user-profile-container">
        <div className="user-profile-header">
          <FaUserCircle className="user-profile-icon" />
          <h2 className="user-profile-title">
            {user.role === 'admin' ? 'Admin Profile' : user.role === 'supervisor' ? 'Supervisor Profile' : 'User Profile'}
          </h2>
        </div>
        <div className="user-profile-user-icon"></div>
        <div className="user-profile-details">
          <div className="user-profile-detail-item">
            <span className="user-profile-detail-label">First Name:</span>
            <span className="user-profile-detail-value">{user.firstName}</span>
          </div>
          <div className="user-profile-detail-item">
            <span className="user-profile-detail-label">Last Name:</span>
            <span className="user-profile-detail-value">{user.lastName}</span>
          </div>
          {user.role === 'admin' && (
            <div className="user-profile-detail-item">
              <span className="user-profile-detail-label">Company Name:</span>
              <span className="user-profile-detail-value">{user.companyName}</span>
            </div>
          )}
          <div className="user-profile-detail-item">
            <span className="user-profile-detail-label">Email:</span>
            <span className="user-profile-detail-value">{user.email}</span>
          </div>
          <div className="user-profile-detail-item">
            <span className="user-profile-detail-label">Phone Number:</span>
            <span className="user-profile-detail-value">{user.phoneNumber}</span>
          </div>
          <div className="user-profile-detail-item">
            <span className="user-profile-detail-label">Address:</span>
            <span className="user-profile-detail-value">{user.address}</span>
          </div>
          <div className="user-profile-detail-item">
            <span className="user-profile-detail-label">Role:</span>
            <span className="user-profile-detail-value">{displayRole}</span>
          </div>
        </div>
        <div className="user-profile-actions">
          <button className="user-profile-edit-btn" onClick={() => navigate('/edit-profile')}>
            Edit Profile
          </button>
          {user.role === 'supervisor' && (
            <button className="user-profile-delete-btn" onClick={handleDelete}>
              Delete Profile
            </button>
          )}
          <button className="user-profile-logout-btn" onClick={handleLogout}>
            Logout
          </button>
          {(user.role === 'admin' || user.role === 'supervisor') && (
            <button className="user-profile-dashboard-btn" onClick={() => navigate('/')}>
              Dashboard
            </button>
          )}
        </div>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 500,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#4CAF50',
            },
          },
          error: {
            style: {
              background: '#f44336',
            },
          },
        }}
      />
    </div>
  );
};

export default ProfileUser;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import '../../css/EditProfile.css'; // Updated CSS import

const EditProfile = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
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

        setUser({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          companyName: response.data.companyName || '',
          email: response.data.email || '',
          phoneNumber: response.data.phoneNumber || '',
          address: response.data.address || '',
          password: '',
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

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
      `${import.meta.env.VITE_API_URL}/api/auth/me`,
        user,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Profile updated successfully', {
        duration: 2000,
      });
      
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        <div className="edit-profile-header">
          <span className="edit-profile-icon">👤</span>
          <h2 className="edit-profile-title">Edit Profile</h2>
        </div>
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="edit-profile-detail-item">
            <label className="edit-profile-label">First Name:</label>
            <input
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              className="edit-profile-input"
            />
          </div>
          <div className="edit-profile-detail-item">
            <label className="edit-profile-label">Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              className="edit-profile-input"
            />
          </div>
          <div className="edit-profile-detail-item">
            <label className="edit-profile-label">Company Name:</label>
            <input
              type="text"
              name="companyName"
              value={user.companyName}
              onChange={handleChange}
              className="edit-profile-input"
            />
          </div>
          <div className="edit-profile-detail-item">
            <label className="edit-profile-label">Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              disabled
              className="edit-profile-input edit-profile-disabled"
            />
          </div>
          <div className="edit-profile-detail-item">
            <label className="edit-profile-label">Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleChange}
              className="edit-profile-input"
            />
          </div>
          <div className="edit-profile-detail-item">
            <label className="edit-profile-label">Address:</label>
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
              className="edit-profile-input"
            />
          </div>
          {/* <div className="edit-profile-detail-item">
            <label className="edit-profile-label">Password (leave blank to keep current):</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="edit-profile-input"
            />
          </div> */}
          <div className="edit-profile-actions">
            <button type="submit" className="edit-profile-save-btn">
              Save Changes
            </button>
            <button
              type="button"
              className="edit-profile-cancel-btn"
              onClick={() => navigate('/profile')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
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

export default EditProfile;
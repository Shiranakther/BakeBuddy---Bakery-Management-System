import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../css/Header.css';

import logo from '../images/logo.png';
import profilepic from '../images/profile-image.png';
import notificationImage from '../images/notification-image.png';

export default function Header() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Function to handle profile icon click
  const handleProfileClick = () => {
    navigate('/profile'); // Navigate to the profile page
  };

  return (
    <>
      <header>
        <div className="header-container">
          <div className="logo-section">
            <img src={logo} alt="Bakebuddy" className="logo-image" />
          </div>
          <div className="profile-notification-wrapper">
            <div className="notification-wrapper">
              <div className="notification-image">
                <img
                  src={notificationImage}
                  alt="Notification-icon"
                  className="notification-image-icon"
                />
              </div>
              <div className="notification-text">Notifications</div>
              <div className="notification-count">5</div>
            </div>
            <div className="profile-wrapper" onClick={handleProfileClick}>
              <div className="profile-image">
                <img
                  src={profilepic}
                  alt="profile"
                  className="profile-image"
                />
              </div>
              <div className="user-name">
                <span>User</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
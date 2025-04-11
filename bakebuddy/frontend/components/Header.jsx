import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Header.css';
import { FaUserCircle, FaPowerOff, FaBell } from 'react-icons/fa'; // Importing React icons

import logo from '../images/logo.png';

export default function Header() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decodedToken.role || 'Unknown');
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserRole('Unknown');
      }
    }
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileNavigation = () => {
    setIsDropdownOpen(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const handleShutdownClick = () => {
    // Add your shutdown functionality here
    console.log('Shutdown clicked');
    // You might want to add confirmation dialog and shutdown logic
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
              <FaBell className="notification-icon" />
              <div className="notification-text">Notifications</div>
              <div className="notification-count">5</div>
            </div>
            <div className="action-buttons">
              <div className="shutdown-wrapper" onClick={handleShutdownClick}>
                
              </div>
              <div className="profile-wrapper" onClick={handleProfileClick}>
                <div className="profile-role-container">
                  <FaUserCircle className="profile-icon" />
                  <div className="role-display">
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </div>
                </div>
                {isDropdownOpen && (
                  <div className="profile-dropdown">
                    <div
                      className="dropdown-item"
                      onClick={handleProfileNavigation}
                    >
                      Profile
                    </div>
                    <div className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
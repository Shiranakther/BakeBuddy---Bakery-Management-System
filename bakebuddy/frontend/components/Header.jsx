import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Header.css';
import { FaUserCircle, FaPowerOff, FaBell } from 'react-icons/fa'; // Importing React icons
import { FaEnvelope, FaEnvelopeOpen } from "react-icons/fa";
import logo from '../images/logo.png';

export default function Header() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState('');


  const [notifications,setNotifications] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef(null);

  
  const fetchNotificationData = async () =>{
      try{
          const response = await axios.get("http://localhost:5000/api/notification/");
          setNotifications(response.data);
          
          
      }catch(e){
          console.log(e);
      }
  }

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
};

const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
    }
  }

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, []);
  

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
    fetchNotificationData();
   
  }, [],notifications);

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

  const calculateDays = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInMs = now - createdDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hr ago`;
  
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };

  const markAsRead = async (id) => {
    try {
      // Send a PATCH request to update the isRead status on the backend
      await axios.put(`http://localhost:5000/api/notification/${id}`, { isRead: true });
  
      // Update the local state to reflect the change in isRead status
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification._id === id ? { ...notification, isRead: true } : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };
  
  
  return (
    <>
      <header>
        <div className="header-container">
          <div className="logo-section">
            <img src={logo} alt="Bakebuddy" className="logo-image" />
          </div>
          <div className="profile-notification-wrapper">
            
          <div className="notification-container">
              <div className="notification-wrapper" onClick={toggleDropdown}>
                <FaBell className="notification-icon" />
                <div className="notification-text">Notifications</div>
                <div className="notification-count">
                  {notifications.filter(notification => !notification.isRead).length}
                </div>
              </div>

              {isOpen && (
                    <div ref={notificationRef} className="notification-dropdown">
                      {notifications.length > 0 ? (
                        notifications
                         .slice() // Create a shallow copy to avoid modifying the original state
                         .reverse() // Reverse the array order
                         .map((notification) => (
                        <div 
                          key={notification._id} 
                          className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                          onClick={() => markAsRead(notification._id)}  // Trigger markAsRead on click
                        >
                          <div className="notification-message-container">
                            <div className="notification-message-container-details">
                              <div className="notification-message-title">{notification.title}</div>
                              <div className="notification-message-message">{notification.message}</div>
                            </div>
                            <div className="notification-message-container-status">
                              <div className="notification-message-message"
                               onClick={(e) => {
                                e.stopPropagation();  // Prevent the parent click event from triggering
                                markAsRead(notification._id, notification.isRead);  // Trigger the toggle of the read/unread status
                              }}
                              >
                                {notification.isRead ? (
                                  <FaEnvelopeOpen color="green" />
                                ) : (
                                  <FaEnvelope color="rgb(93, 93, 93)" />
                                )}
                              </div>
                              <div className="notification-message-message">{calculateDays(notification.createdAt)}</div>
                            </div>
                          </div>
                        </div>

                        ))
                      ) : (
                        <p>No new notifications 🎉</p>
                      )}
                    </div>
                  )}
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

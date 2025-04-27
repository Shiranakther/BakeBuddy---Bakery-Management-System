import React from 'react'
import '../css/Header.css'

import logo from '../images/logo.png'
import profilepic from '../images/profile-image.png'
import notificationImage from '../images/notification-image.png'


export default function Headercomponent() {

  return (
    <>
     <header>
        <div className="container">
            <div className="logo-section">
                <img src={logo} alt="Bakebuddy" className="logo-image"/>
            </div>
            <div className="profile-notification-wrapper">
                <div className="notification-wrapper">
                    <div className="notification-image">
                    <img src={notificationImage} alt="Notification-icon" className="notification-image-icon"/>
                    
                    </div>
                    <div className="notification-text">Notifications</div>
                    <div className="notification-count">5</div>
                    <p>{notifications.count}</p>
                </div>
                <div className="profile-wrapper">
                    <div className="profile-image">
                        <img src={profilepic} alt="profile" className="profile-image"/>
                    </div>
                    <div className="user-name">
                        <span>User</span>
                    </div>
                </div>
            </div>
        </div>
     </header>
    </>
  )
}

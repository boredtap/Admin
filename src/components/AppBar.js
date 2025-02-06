import React from 'react';
import './AppBar.css';

const AppBar = ({ screenName }) => {
  const currentDate = new Date();
  const time = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = currentDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="app-bar2">
      <div className="left-section2">
        <div className="title-and-time2">
          <span className="screen-name2">{screenName}</span>
          <div className="time-date2">
            <span className="time2">{time}</span>
            <span className="date2">{date}</span>
          </div>
        </div>
      </div>
      <div className="middle-section2">
        <div className="search2-bar">
          <img
            src={`${process.env.PUBLIC_URL}/search.png`}
            alt="Search"
            className="search2-icon"
          />
          <input type="text" placeholder="Search..." className="search2-input" />
        </div>
      </div>
      <div className="right-section2">
        <img
          src={`${process.env.PUBLIC_URL}/notification.png`}
          alt="Notification"
          className="notification-icon2"
        />
        <div className="profile">
          <img
            src={`${process.env.PUBLIC_URL}/profile-picture.png`}
            alt="Profile"
            className="profile-picture2"
          />
          <div className="profile-info2">
            <span className="username2">Isreal A.</span>
            <span className="role2">Super Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppBar;

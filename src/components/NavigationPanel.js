import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NavigationPanel.css';

const NavigationPanel = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To track the current active path

  const menuItems = [
    { name: 'Dashboard', icon: 'logo.png', path: '/dashboard' },
    { name: 'Tasks', icon: 'task.png', path: '/tasks' },
    { name: 'Rewards', icon: 'reward.png', path: '/rewards' },
    { name: 'Challenges', icon: 'challenge.png', path: '/challenges' },
    { name: 'Clans', icon: 'clan.png', path: '/clans' },
    { name: 'Leaderboard', icon: 'leaderboard12-icon.png', path: '/leaderboard' },
    // { name: 'Invite', icon: 'invite.png', path: '/invite' },
    { name: 'Boosts', icon: 'boostx2.png', path: '/boosts' },
    { name: 'Levels', icon: 'level.png', path: '/levels' },
    { name: 'Users', icon: 'user management.png', path: '/users' },
    { name: 'Security', icon: 'security.png', path: '/security' },
  ];

  return (
    <div className="navigation-panel">
      <div className="logo-section">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="logo-icon" />
        <span className="logo-text">BoredTap</span>
      </div>
      <div className="menu">
        <div className="scrollable-menu">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <img src={`${process.env.PUBLIC_URL}/${item.icon}`} alt={item.name} className="menu-icon" />
              <span className="menu-text">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationPanel;
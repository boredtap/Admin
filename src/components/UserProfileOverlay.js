import React from 'react';
import './UserProfileOverlay.css';

const UserProfileOverlay = ({ onClose, user }) => {
  return (
    <div className="user-profile-overlay">
      <div className="overlay-header">
        <h1>User Profile</h1>
        <span className="cancel-icon" onClick={onClose}>×</span>
      </div>
      <div className="profile-image">
        <img src={user.profileImage} alt="Profile" width="80" height="80" />
      </div>
      <div className="user-info">
        <h2 className="username">{user.username}</h2>
        <p className="level">Level: {user.level}</p>
      </div>
      <div className="achievements">
        <h3>Overall Achievement</h3>
        <hr />
        <div className="achievement-row">
          <span className="achievement-title">Total Coin:</span> <span className="achievement-value">{user.totalCoin}</span>
        </div>
        {/* Add other achievement data similarly */}
      </div>
      <div className="today-achievements">
        <h3>Today Achievement</h3>
        <hr />
        <div className="achievement-row">
          <span className="achievement-title">Total Coin:</span> <span className="achievement-value">{user.todayCoin}</span>
        </div>
        {/* Add other today's achievement data */}
      </div>
      <div className="wallet">
        <h3>Wallet Address</h3>
        <hr />
        <img src="path/to/wallet-icon.png" alt="Wallet Icon" width="50" height="50" />
        <span>{user.walletAddress}</span>
        <button className="disconnect-btn">Disconnect</button>
      </div>
      <div className="clan">
        <h3>Clan</h3>
        <hr />
        <div className="clan-info">
          <span className="clan-title">Clan Name:</span> <span className="clan-value">{user.clanName}</span>
        </div>
        <div className="clan-info">
          <span className="clan-title">In-Clan Rank:</span> <span className="clan-value">{user.clanRank}</span>
        </div>
      </div>
      <div className="action-buttons">
        <button className="suspend-btn">Suspend</button>
        <button className="reward-btn">Reward</button>
      </div>
    </div>
  );
};

export default UserProfileOverlay;
import React, { useState, useEffect } from 'react';
import './UserProfileOverlay.css';

const UserProfileOverlay = ({ onClose, user }) => {
  const [profile, setProfile] = useState(null);

  // Fetch profile data from backend using telegram_user_id
  useEffect(() => {
    if (user?.telegram_user_id) {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error("No access token found");
        return;
      }
      fetch(`https://bt-coins.onrender.com/admin/leaderboard/leaderboard_profile?telegram_user_id=${user.telegram_user_id}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error("Error fetching profile", err));
    }
  }, [user]);

  // Use the fetched profile data if available, otherwise fallback to the passed user
  const displayData = profile || user || {};

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="user-profile-overlay" onClick={(e) => e.stopPropagation()}>
        <div className="overlay-header">
          <h1>User Profile</h1>
          <span className="cancel-icon" onClick={onClose}>×</span>
        </div>

        <div className="profile-section">
          <div className="profile-image">
            <img src={displayData.image_url} alt="Profile" width="80" height="80" />
          </div>
          <div className="user-info">
            <h2 className="username">{displayData.username}</h2>
            <p className="level">Level: {displayData.level} - {displayData.level_name}</p>
          </div>
        </div>

        <div className="achievement-section">
          <h3>Overall Achievement</h3>
          <hr />
          <div className="achievement-row">
            <div className="achievement-item">
              <span className="achievement-title">Total Coins</span>
              <span className="achievement-value">{displayData.overall_achievement?.total_coin}</span>
            </div>
            <div className="achievement-item">
              <span className="achievement-title">Completed Tasks</span>
              <span className="achievement-value">{displayData.overall_achievement?.completed_tasks}</span>
            </div>
            <div className="achievement-item">
              <span className="achievement-title">Highest Streak</span>
              <span className="achievement-value">{displayData.overall_achievement?.longest_streak}</span>
            </div>
            <div className="achievement-item">
              <span className="achievement-title">Rank</span>
              <span className="achievement-value">{displayData.overall_achievement?.rank}</span>
            </div>
            <div className="achievement-item">
              <span className="achievement-title">Invitees</span>
              <span className="achievement-value">{displayData.overall_achievement?.invitees ?? '-'}</span>
            </div>
          </div>
        </div>

        {/* Divider line before Today Achievement */}
        <hr className="section-divider" />
        <div className="achievement-section">
          <h3>Today Achievement</h3>
          <hr />
          <div className="achievement-row">
            <div className="achievement-item">
              <span className="achievement-title">Total Coins</span>
              <span className="achievement-value">{displayData.today_achievement?.total_coin}</span>
            </div>
            <div className="achievement-item">
              <span className="achievement-title">Completed Tasks</span>
              <span className="achievement-value">{displayData.today_achievement?.completed_tasks}</span>
            </div>
            <div className="achievement-item">
              <span className="achievement-title">Current Streak</span>
              <span className="achievement-value">{displayData.today_achievement?.current_streak}</span>
            </div>
            <div className="achievement-item">
              <span className="achievement-title">Rank</span>
              <span className="achievement-value">{displayData.today_achievement?.rank}</span>
            </div>
            <div className="achievement-item">
              <span className="achievement-title">Invitees</span>
              <span className="achievement-value">{displayData.today_achievement?.invitees ?? '-'}</span>
            </div>
          </div>
        </div>

        {/* Divider line before Wallet */}
        <hr className="section-divider" />
        <div className="wallet-section">
          <h3>Wallet Address</h3>
          <hr />
          <div className="wallet-row">
            {displayData.wallet_address ? (
              <>
                <span className="wallet-value">{displayData.wallet_address}</span>
                <button className="disconnect-btn">Disconnect</button>
              </>
            ) : (
              <>
                <img src={`${process.env.PUBLIC_URL}/wallet.png`} alt="Wallet Icon" width="50" height="50" />
                <span className="wallet-value">-</span>
              </>
            )}
          </div>
        </div>

        {/* Divider line before Clan */}
        <hr className="section-divider" />
        <div className="clan-section">
          <h3>Clan</h3>
          <hr />
          <div className="clan-row">
            <div className="clan-item">
              <span className="clan-title">Clan Name</span>
              <span className="clan-value">{displayData.clan?.clan_name || '-'}</span>
            </div>
            <div className="clan-item">
              <span className="clan-title">In-Clan Rank</span>
              <span className="clan-value">{displayData.clan?.in_clan_rank || '-'}</span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="suspend2-btn">
            <img src={`${process.env.PUBLIC_URL}/suspend.png`} alt="Suspend" className="btn-icon" />
            Suspend
          </button>
          <button className="reward-btn">
            <img src={`${process.env.PUBLIC_URL}/add2.png`} alt="Reward" className="btn-icon" />
            Reward
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileOverlay;

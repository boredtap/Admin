import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationPanel from '../components/NavigationPanel';
import AppBar from '../components/AppBar';
import './Dashboard.css';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Dashboard = () => {
  const recentActivitiesChartRef = useRef(null);
  const userLevelChartRef = useRef(null);
  const walletConnectionChartRef = useRef(null);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalUsersPercentage: 0,
    newUsers: 0,
    newUsersPercentage: 0,
    totalCoinEarned: 0,
    totalCoinEarnedPercentage: 0,
    tokenDistributedPercentage: 0,
    totalCoinEarnedMonthly: [],
    totalUsersMonthly: [],
    userLevels: [],
    walletConnections: [],
    newUsersList: [],
    leaderboardList: []
  });

  const fetchData = async (url, key) => {
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching ${key}: ${response.statusText}`);
      }
      const data = await response.json();
      setDashboardData(prev => ({ ...prev, [key]: data[key] || data }));
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
    }
  };

  useEffect(() => {
    fetchData('https://bored-tap-api.onrender.com/admin/dashboard/overall_total_users', 'totalUsers');
    fetchData('https://bored-tap-api.onrender.com/admin/dashboard/total_new_users', 'newUsers');
    fetchData('https://bored-tap-api.onrender.com/admin/dashboard/overall_total_coin_earned', 'totalCoinEarned');
    fetchData('https://bored-tap-api.onrender.com/admin/dashboard/token_distributed_percentage', 'tokenDistributedPercentage');
    fetchData('https://bored-tap-api.onrender.com/admin/dashboard/total_coin_earned_monthly', 'totalCoinEarnedMonthly');
    fetchData('https://bored-tap-api.onrender.com/admin/dashboard/total_users_monthly', 'totalUsersMonthly');
    fetchData('https://bored-tap-api.onrender.com/admin/dashboard/user_levels', 'userLevels');
    fetchData('https://bored-tap-api.onrender.com/admin/dashboard/wallet_connections', 'walletConnections');
    fetchData('https://bored-tap-api.onrender.com/admin/dashboard/new_users', 'newUsersList');
    fetchData('https://bored-tap-api.onrender.com/admin/dashboard/leaderboard_list', 'leaderboardList');
  }, []);

  useEffect(() => {
    // Recent Activities Line Chart
    const ctx = document.getElementById('recent-activities-graph').getContext('2d');

    if (recentActivitiesChartRef.current) {
      recentActivitiesChartRef.current.destroy();
    }

    recentActivitiesChartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Total Coin Earned',
            data: dashboardData.totalCoinEarnedMonthly,
            borderColor: 'orange',
            borderWidth: 1,
            fill: false,
            tension: 0.0,
          },
          {
            label: 'Total Users',
            data: dashboardData.totalUsersMonthly,
            borderColor: 'green',
            borderWidth: 1,
            fill: false,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Months',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Millions',
            },
            ticks: {
              callback: (value) => `${value}M`,
            },
          },
        },
      },
    });

    // User Level Bar Chart
    const userLevelCtx = document.getElementById('user-level-chart').getContext('2d');

    if (userLevelChartRef.current) {
      userLevelChartRef.current.destroy();
    }

    userLevelChartRef.current = new Chart(userLevelCtx, {
      type: 'bar',
      data: {
        labels: [
          'Novice',
          'Explorer',
          'Apprentice',
          'Warrior',
          'Master',
          'Champion',
          'Tactician', 
          'Specialist',
          'Conqueror',
          'Legend'
        ],
        datasets: [{
          label: 'Number of Users (in Millions)',
          data: dashboardData.userLevels,
          backgroundColor: '#79797A',
          borderColor: '#79797A',
          borderWidth: 25,
          borderRadius: 4,
          barPercentage: 0.6, // Increased from 0.25 to make bars wider
          categoryPercentage: 0.8 // Added to increase bar width
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              maxRotation: 0, // Changed from 45 to 0 for horizontal labels
              minRotation: 0  // Changed from 45 to 0 for horizontal labels
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value + 'M';
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    // Wallet Connection Doughnut Chart
    const walletConnectionCtx = document.getElementById('wallet-connection-chart').getContext('2d');

    if (walletConnectionChartRef.current) {
      walletConnectionChartRef.current.destroy();
    }

    walletConnectionChartRef.current = new Chart(walletConnectionCtx, {
      type: 'doughnut',
      data: {
        labels: ['Wallet Connected', 'No Wallet Connected'],
        datasets: [{
          data: dashboardData.walletConnections,
          backgroundColor: ['#00FF00', '#FF0000'], // Green and Red
          borderWidth: 5, // Increased border width for a thicker line
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '50%', // Reduced cutout to make donut fatter
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    // Cleanup charts when component unmounts
    return () => {
      if (recentActivitiesChartRef.current) {
        recentActivitiesChartRef.current.destroy();
      }
      if (userLevelChartRef.current) {
        userLevelChartRef.current.destroy();
      }
      if (walletConnectionChartRef.current) {
        walletConnectionChartRef.current.destroy();
      }
    };
  }, [dashboardData]);

  return (
    <div className="dashboard">
      <NavigationPanel />
      <div className="main-wrapper">
        <AppBar screenName="Dashboard" />
        <div className="main-content">
          <div className="overview-section">
            <h2 className="overview-title">Overview</h2>
            <div className="data-frames">
              {/* Frame 1: Total Users */}
              <div className="data-frame">
                <div className="frame-header">
                  <img src={`${process.env.PUBLIC_URL}/invite.png`} alt="Total Users" className="frame-icon" />
                  <span className="frame-percentage increment">
                    +{dashboardData.totalUsersPercentage}%
                    <img src={`${process.env.PUBLIC_URL}/ArrowRise.png`} alt="Increment" className="frame-percentage-icon" />
                  </span>
                </div>
                <div className="frame-value">{dashboardData.totalUsers.toLocaleString()}</div>
                <div className="frame-title">Total Users</div>
              </div>

              {/* Frame 2: Total New Users */}
              <div className="data-frame">
                <div className="frame-header">
                  <img src={`${process.env.PUBLIC_URL}/invite.png`} alt="New Users" className="frame-icon" />
                  <span className="frame-percentage increment">
                    +{dashboardData.newUsersPercentage}%
                    <img src={`${process.env.PUBLIC_URL}/ArrowRise.png`} alt="Increment" className="frame-percentage-icon" />
                  </span>
                </div>
                <div className="frame-value">{dashboardData.newUsers.toLocaleString()}</div>
                <div className="frame-title">Total New Users</div>
              </div>

              {/* Frame 3: Total Coin Earned */}
              <div className="data-frame">
                <div className="frame-header">
                  <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Total Coin Earned" className="frame-icon" />
                  <span className="frame-percentage decrement">
                    {dashboardData.totalCoinEarnedPercentage}%
                    <img src={`${process.env.PUBLIC_URL}/ArrowFall.png`} alt="Decrement" className="frame-percentage-icon" />
                  </span>
                </div>
                <div className="frame-value">{dashboardData.totalCoinEarned.toLocaleString()}</div>
                <div className="frame-title">Total Coin Earned</div>
              </div>

              {/* Frame 4: Token Distributed */}
              <div className="data-frame">
                <div className="frame-header">
                  <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Token Distributed" className="frame-icon" />
                  <span className="frame-percentage increment">
                    +{dashboardData.tokenDistributedPercentage}%
                    <img src={`${process.env.PUBLIC_URL}/ArrowRise.png`} alt="Increment" className="frame-percentage-icon" />
                  </span>
                </div>
                <div className="frame-value">0</div>
                <div className="frame-title">Token Distributed</div>
              </div>
            </div>
          </div>

          {/* Recent Activities Section */}
          <div className="recent-activities big-frame">
            <h2 className="section-title">Recent Activities</h2>
            <div className="recent-activities-header">
              <div className="pagination">
                <span className="active">Total Coin Earned</span>
                <span className="separator">|</span>
                <span className="inactive">Total Users</span>
              </div>
              <div className="time-filters">
                <span className="active">This Year</span>
                <span className="separator">|</span>
                <span className="inactive">Last Year</span>
              </div>
            </div>
            <div className="graph-container">
              <canvas id="recent-activities-graph"></canvas>
            </div>
          </div>

          {/* User Level and Wallet Connection Section */}
          <div className="user-level-wallet-section">
            <div className="user-level-frame">
              <h2 className="section-title">User Level</h2>
              <div className="small-frame">
                <canvas id="user-level-chart"></canvas>
              </div>
            </div>
            <div className="wallet-connection-frame">
              <h2 className="section-title">Wallet Connection</h2>
              <div className="small-frame">
                <canvas id="wallet-connection-chart"></canvas>
                <div className="wallet-connection-legend">
                  <div className="legend-item">
                    <span className="dot green"></span>
                    <span className="legend-text">Wallet Connected</span>
                  </div>
                  <div className="legend-item">
                    <span className="dot red"></span>
                    <span className="legend-text">No Wallet Connected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Other sections of the dashboard */}
        </div>
        <div className="right-panel">
          <div className="panel-section new-users">
            <div className="panel-header">
              <h3 className="panel-title">New Users</h3>
              <div className="panel-action">
                <span className="see-all" onClick={() => navigate('/users')}>See all</span>
                <img src={`${process.env.PUBLIC_URL}/front-arrow.png`} alt="See all" className="see-all-icon" />
              </div>
            </div>
            <div className="panel-frame">
              <ul className="user-list">
                {dashboardData.newUsersList.slice(0, 10).map((user, index) => (
                  <li key={index} className="user-item">
                    <img src={`${process.env.PUBLIC_URL}/profile-picture.png`} alt="Profile" className="profile-picture" />
                    <span className="username">{user.username}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="panel-section leaderboard">
            <div className="panel-header">
              <h3 className="panel-title">Leaderboard</h3>
              <div className="panel-action">
                <span className="see-all" onClick={() => navigate('/leaderboard')}>See all</span>
                <img src={`${process.env.PUBLIC_URL}/front-arrow.png`} alt="See all" className="see-all-icon" />
              </div>
            </div>
            <div className="panel-frame">
              <ul className="user-list">
                {dashboardData.leaderboardList.slice(0, 10).map((leader, index) => (
                  <li key={index} className="user-item">
                    <img src={`${process.env.PUBLIC_URL}/profile-picture.png`} alt="Profile" className="profile-picture" />
                    <span className="username">{leader.username}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
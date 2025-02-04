import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  const ws = useRef(null);

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
    leaderboardList: [],
    recentCoinActivity: [],
    recentUserActivity: []
  });

  const isTokenExpired = (token) => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  };

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await fetch('https://bored-tap-api.onrender.com/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: 'string',
          client_secret: 'string',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        return data.access_token;
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      navigate('/');
    }
  }, [navigate]);

  const fetchData = useCallback(async (url, key) => {
    try {
      let token = localStorage.getItem('access_token');
      if (!token || isTokenExpired(token)) {
        token = await refreshToken();
        if (!token) return;
      }
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching ${key}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Fetched ${key}:`, data); // Log fetched data
      setDashboardData(prev => ({ ...prev, [key]: data }));
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      if (error.message === 'Token expired or not found' || error.message.includes('401')) {
        navigate('/signin');
      }
    }
  }, [navigate, refreshToken]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token || isTokenExpired(token)) {
      refreshToken().then(newToken => {
        if (newToken) {
          fetchData('https://bored-tap-api.onrender.com/admin/dashboard/overall_total_users', 'totalUsers');
          fetchData('https://bored-tap-api.onrender.com/admin/dashboard/total_new_users', 'newUsers');
          fetchData('https://bored-tap-api.onrender.com/admin/dashboard/overall_total_coins_earned', 'totalCoinEarned');
          fetchData('https://bored-tap-api.onrender.com/admin/dashboard/new_users', 'newUsersList');
          fetchData('https://bored-tap-api.onrender.com/admin/dashboard/leaderboard', 'leaderboardList');
          fetchData('https://bored-tap-api.onrender.com/admin/dashboard/coins/recent_activity', 'recentCoinActivity');
          fetchData('https://bored-tap-api.onrender.com/admin/dashboard/users/recent_activity', 'recentUserActivity');
          fetchData('https://bored-tap-api.onrender.com/admin/dashboard/levels/chart_data', 'userLevels');
        }
      });
    } else {
      fetchData('https://bored-tap-api.onrender.com/admin/dashboard/overall_total_users', 'totalUsers');
      fetchData('https://bored-tap-api.onrender.com/admin/dashboard/total_new_users', 'newUsers');
      fetchData('https://bored-tap-api.onrender.com/admin/dashboard/overall_total_coins_earned', 'totalCoinEarned');
      fetchData('https://bored-tap-api.onrender.com/admin/dashboard/new_users', 'newUsersList');
      fetchData('https://bored-tap-api.onrender.com/admin/dashboard/leaderboard', 'leaderboardList');
      fetchData('https://bored-tap-api.onrender.com/admin/dashboard/coins/recent_activity', 'recentCoinActivity');
      fetchData('https://bored-tap-api.onrender.com/admin/dashboard/users/recent_activity', 'recentUserActivity');
      fetchData('https://bored-tap-api.onrender.com/admin/dashboard/levels/chart_data', 'userLevels');
    }

    // Set up WebSocket connection
    ws.current = new WebSocket('wss://bored-tap-api.onrender.com/ws');
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WebSocket message received:', message);
      setDashboardData(prev => ({ ...prev, ...message }));
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [fetchData, navigate, refreshToken]);

  useEffect(() => {
    console.log('Recent Coin Activity:', dashboardData.recentCoinActivity);
    console.log('Recent User Activity:', dashboardData.recentUserActivity);

    const coinActivityData = dashboardData.recentCoinActivity.map(item => item.data);
    const userActivityData = dashboardData.recentUserActivity.map(item => item.data);

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
            data: coinActivityData,
            borderColor: 'orange',
            borderWidth: 1,
            fill: false,
            tension: 0.0,
          },
          {
            label: 'Total Users',
            data: userActivityData,
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
              text: 'Count',
            },
            ticks: {
              callback: (value) => `${value}`,
            },
          },
        },
      },
    });

    // Cleanup charts when component unmounts
    return () => {
      if (recentActivitiesChartRef.current) {
        recentActivitiesChartRef.current.destroy();
      }
    };
  }, [dashboardData.recentCoinActivity, dashboardData.recentUserActivity]);

  useEffect(() => {
    const userLevelData = dashboardData.userLevels.map(item => item.total_users);
    const userLevelLabels = dashboardData.userLevels.map(item => item.level_name);

    // User Level Bar Chart
    const userLevelCtx = document.getElementById('user-level-chart').getContext('2d');

    if (userLevelChartRef.current) {
      userLevelChartRef.current.destroy();
    }

    userLevelChartRef.current = new Chart(userLevelCtx, {
      type: 'bar',
      data: {
        labels: userLevelLabels,
        datasets: [{
          label: 'Number of Users',
          data: userLevelData,
          backgroundColor: '#79797A',
          borderColor: '#79797A',
          borderWidth: 6,
          borderRadius: 4,
          barPercentage: 0.1, // Increased from 0.25 to make bars wider
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
                return value;
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

    // Cleanup charts when component unmounts
    return () => {
      if (userLevelChartRef.current) {
        userLevelChartRef.current.destroy();
      }
    };
  }, [dashboardData.userLevels]);
  
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
                <div className="frame-value">{dashboardData.totalUsers.total_users}</div>
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
                <div className="frame-value">{dashboardData.newUsers.total_new_users}</div>
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
                <div className="frame-value">{dashboardData.totalCoinEarned.overall_total_coins}</div>
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
            <div className="wallet-connection-frame dormant">
              <h2 className="section-title">Wallet Connection</h2>
              <div className="small-frame">
                <div className="coming-soon">
                  <span>Coming Soon</span>
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
                    <img src={user.image_url} alt="Profile" className="profile-picture" />
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
                    <img src={leader.image_url} alt="Profile" className="profile-picture" />
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
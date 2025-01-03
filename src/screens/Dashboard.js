<<<<<<< HEAD
import React, { useEffect, useRef } from 'react'; // Added useRef import
import NavigationPanel from '../components/NavigationPanel';
import AppBar from '../components/AppBar';
import './Dashboard.css';
import { Chart, registerables } from 'chart.js'; // Ensure Chart.js is properly imported and registerables is included
Chart.register(...registerables); // Register all chart types

const Dashboard = () => {
  const recentActivitiesChartRef = useRef(null);
  const userLevelChartRef = useRef(null);
  const walletConnectionChartRef = useRef(null);

  // Initialize the "Recent Activities" chart
  useEffect(() => {
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
            data: [0, 2, 5, 10, 25, 50, 70, 85, 90, 95, 98, 100],
            borderColor: 'orange',
            borderWidth: 2,
            fill: false,
            tension: 0.3,
          },
          {
            label: 'Total Users',
            data: [5, 10, 15, 20, 30, 45, 65, 75, 85, 90, 95, 100],
            borderColor: 'green',
            borderWidth: 2,
            fill: false,
            tension: 0.3,
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

    return () => {
      if (recentActivitiesChartRef.current) {
        recentActivitiesChartRef.current.destroy();
      }
    };
  }, []);

  // Initialize the "User Level" bar chart
  useEffect(() => {
    const ctx = document.getElementById('user-level-chart').getContext('2d');

    if (userLevelChartRef.current) {
      userLevelChartRef.current.destroy();
    }

    userLevelChartRef.current = new Chart(ctx, {
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
          'Legend',
        ],
        datasets: [
          {
            label: 'Number of Users (in Millions)',
            data: [0.5, 1, 2, 3, 5, 6, 7, 8, 9, 10],
            backgroundColor: 'grey',
            borderColor: 'grey',
            borderWidth: 1,
            barThickness: 32,
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
              text: 'User Levels',
              color: 'white',
              font: {
                size: 14,
              },
            },
            ticks: {
              color: 'white',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Number of Users (Millions)',
              color: 'white',
              font: {
                size: 14,
              },
            },
            ticks: {
              color: 'white',
              callback: (value) => `${value}M`,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    return () => {
      if (userLevelChartRef.current) {
        userLevelChartRef.current.destroy();
      }
    };
  }, []);

  // Initialize "Wallet Connection" donut chart
  useEffect(() => {
    const ctx = document.getElementById('wallet-connection-chart').getContext('2d');
  
    if (walletConnectionChartRef.current) {
      walletConnectionChartRef.current.destroy();
    }
  
    walletConnectionChartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Wallet Connected', 'No Wallet Connected'],
        datasets: [
          {
            data: [75, 25],
            backgroundColor: ['#00FF00', '#FF0000'], // Green and Red
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%', // Makes the donut slimmer
        plugins: {
          legend: {
            display: false, // Hide default legend
          },
        },
      },
    });
  
    return () => {
      if (walletConnectionChartRef.current) {
        walletConnectionChartRef.current.destroy();
      }
    };
  }, []);

=======
import React from 'react';
import NavigationPanel from '../components/NavigationPanel';
import AppBar from '../components/AppBar';
import './Dashboard.css';

const Dashboard = () => {
>>>>>>> 276fc0966a98df77bcd4a6ad8d4ededc8e50ed49
  return (
    <div className="dashboard">
      <NavigationPanel />
      <div className="main-wrapper">
        <AppBar screenName="Dashboard" />
        <div className="main-content">
<<<<<<< HEAD
          {/* Overview Section */}
          <div className="overview-section">
            <h2 className="overview-title">Overview</h2>
            <div className="data-frames">
              {/* Frame 1: Total Users */}
              <div className="data-frame">
                <div className="frame-header">
                  <img
                    src={`${process.env.PUBLIC_URL}/invite.png`}
                    alt="Total Users"
                    className="frame-icon"
                  />
                  <span className="frame-percentage increment">
                    +11.01%
                    <img
                      src={`${process.env.PUBLIC_URL}/ArrowRise.png`}
                      alt="Increment"
                      className="frame-percentage-icon"
                    />
                  </span>
                </div>
                <div className="frame-value">7,280,218</div>
                <div className="frame-title">Total Users</div>
              </div>

              {/* Frame 2: Total New Users */}
              <div className="data-frame">
                <div className="frame-header">
                  <img
                    src={`${process.env.PUBLIC_URL}/invite.png`}
                    alt="New Users"
                    className="frame-icon"
                  />
                  <span className="frame-percentage increment">
                    +26.10%
                    <img
                      src={`${process.env.PUBLIC_URL}/ArrowRise.png`}
                      alt="Increment"
                      className="frame-percentage-icon"
                    />
                  </span>
                </div>
                <div className="frame-value">62,218</div>
                <div className="frame-title">Total New Users</div>
              </div>

              {/* Frame 3: Total Coin Earned */}
              <div className="data-frame">
                <div className="frame-header">
                  <img
                    src={`${process.env.PUBLIC_URL}/logo.png`}
                    alt="Total Coin Earned"
                    className="frame-icon"
                  />
                  <span className="frame-percentage decrement">
                    -0.06%
                    <img
                      src={`${process.env.PUBLIC_URL}/ArrowFall.png`}
                      alt="Decrement"
                      className="frame-percentage-icon"
                    />
                  </span>
                </div>
                <div className="frame-value">129,037,280,218</div>
                <div className="frame-title">Total Coin Earned</div>
              </div>

              {/* Frame 4: Token Distributed */}
              <div className="data-frame">
                <div className="frame-header">
                  <img
                    src={`${process.env.PUBLIC_URL}/logo.png`}
                    alt="Token Distributed"
                    className="frame-icon"
                  />
                  <span className="frame-percentage increment">
                    +7.01%
                    <img
                      src={`${process.env.PUBLIC_URL}/ArrowRise.png`}
                      alt="Increment"
                      className="frame-percentage-icon"
                    />
                  </span>
                </div>
                <div className="frame-value">46,037,280,218</div>
                <div className="frame-title">Token Distributed</div>
              </div>
            </div>
          </div>

          {/* Recent Activities Section */}
          <div className="recent-activities">
            <h2 className="section-title">Recent Activities</h2>
            <div className="big-frame">
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
          </div>

            {/* User Level Section */}
          <div className="user-level-wallet">
            <div className="user-level">
              <h2 className="section-title">User Level</h2>
              <div className="small-frame">
                <canvas id="user-level-chart"></canvas>
              </div>
            </div>

            {/* Wallet Connection Section */}
            <div className="wallet-connection">
              <h2 className="section-title">Wallet Connection</h2>
              <div className="small-frame">
                {/* Donut Chart */}
                <canvas id="wallet-connection-chart"></canvas>
                {/* Legend Inside Frame */}
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
        </div>

        {/* Right Panel Section */}
        <div className="right-panel">
            {/* New Users Section */}
            <div className="new-users">
              <div className="panel-header">
                <h3 className="panel-title">New Users</h3>
                <div className="panel-action">
                  <span className="see-all">See all</span>
                  <img
                    src={`${process.env.PUBLIC_URL}/front-arrow.png`}
                    alt="See all"
                    className="see-all-icon"
                  />
                </div>
              </div>
              <div className="panel-frame">
                <ul className="user-list">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <li key={index} className="user-item">
                      <img
                        src={`${process.env.PUBLIC_URL}/profile-picture.png`}
                        alt="Profile"
                        className="profile-picture"
                      />
                      <span className="username">User {index + 1}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Leaderboard Section */}
            <div className="leaderboard">
              <div className="panel-header">
                <h3 className="panel-title">Leaderboard</h3>
                <div className="panel-action">
                  <span className="see-all">See all</span>
                  <img
                    src={`${process.env.PUBLIC_URL}/front-arrow.png`}
                    alt="See all"
                    className="see-all-icon"
                  />
                </div>
              </div>
              <div className="panel-frame">
                <ul className="user-list">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <li key={index} className="user-item">
                      <img
                        src={`${process.env.PUBLIC_URL}/profile-picture.png`}
                        alt="Profile"
                        className="profile-picture"
                      />
                      <span className="username">Leader {index + 1}</span>
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

=======
          <div className="overview-section">
            <h2 className="overview-title">Overview</h2>
            <div className="data-frames">
              <div className="data-frame">Frame 1</div>
              <div className="data-frame">Frame 2</div>
              <div className="data-frame">Frame 3</div>
              <div className="data-frame">Frame 4</div>
            </div>
          </div>

          <div className="recent-activities">
            <h2 className="section-title">Recent Activities</h2>
            <div className="big-frame">Graph (Recent Activities)</div>
          </div>

          <div className="user-level-wallet">
            <div className="user-level">
              <h2 className="section-title">User Level</h2>
              <div className="small-frame">Graph (User Level)</div>
            </div>
            <div className="wallet-connection">
              <h2 className="section-title">Wallet Connection</h2>
              <div className="small-frame">Graph (Wallet Connection)</div>
            </div>
          </div>
        </div>
        <div className="right-panel">
          <div className="new-users">
            <h3 className="panel-title">New Users</h3>
            <div className="panel-frame">User Data</div>
          </div>
          <div className="leaderboard">
            <h3 className="panel-title">Leaderboard</h3>
            <div className="panel-frame">Leaderboard Data</div>
          </div>
        </div>
      </div>
    </div>
  );
};
>>>>>>> 276fc0966a98df77bcd4a6ad8d4ededc8e50ed49

export default Dashboard;

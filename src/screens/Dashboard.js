import React, { useEffect, useRef } from 'react';
import NavigationPanel from '../components/NavigationPanel';
import AppBar from '../components/AppBar';
import './Dashboard.css';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Dashboard = () => {
  const recentActivitiesChartRef = useRef(null);
  const userLevelChartRef = useRef(null);
  const walletConnectionChartRef = useRef(null);

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
            data: [0, 2, 5, 10, 25, 50, 70, 85, 90, 95, 98, 100],
            borderColor: 'orange',
            borderWidth: 1,
            fill: false,
            tension: 0.0,
          },
          {
            label: 'Total Users',
            data: [5, 10, 15, 20, 30, 45, 65, 75, 85, 90, 95, 100],
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
        data: [0.5, 1, 2, 3, 5, 6, 7, 8, 9, 10],
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
        data: [75, 25],
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
  }, []);

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
                    +11.01%
                    <img src={`${process.env.PUBLIC_URL}/ArrowRise.png`} alt="Increment" className="frame-percentage-icon" />
                  </span>
                </div>
                <div className="frame-value">7,280,218</div>
                <div className="frame-title">Total Users</div>
              </div>

              {/* Frame 2: Total New Users */}
              <div className="data-frame">
                <div className="frame-header">
                  <img src={`${process.env.PUBLIC_URL}/invite.png`} alt="New Users" className="frame-icon" />
                  <span className="frame-percentage increment">
                    +26.10%
                    <img src={`${process.env.PUBLIC_URL}/ArrowRise.png`} alt="Increment" className="frame-percentage-icon" />
                  </span>
                </div>
                <div className="frame-value">62,218</div>
                <div className="frame-title">Total New Users</div>
              </div>

              {/* Frame 3: Total Coin Earned */}
              <div className="data-frame">
                <div className="frame-header">
                  <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Total Coin Earned" className="frame-icon" />
                  <span className="frame-percentage decrement">
                    -0.06%
                    <img src={`${process.env.PUBLIC_URL}/ArrowFall.png`} alt="Decrement" className="frame-percentage-icon" />
                  </span>
                </div>
                <div className="frame-value">129,037,280,218</div>
                <div className="frame-title">Total Coin Earned</div>
              </div>

              {/* Frame 4: Token Distributed */}
              <div className="data-frame">
                <div className="frame-header">
                  <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Token Distributed" className="frame-icon" />
                  <span className="frame-percentage increment">
                    +7.01%
                    <img src={`${process.env.PUBLIC_URL}/ArrowRise.png`} alt="Increment" className="frame-percentage-icon" />
                  </span>
                </div>
                <div className="frame-value">46,037,280,218</div>
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
                <span className="see-all">See all</span>
                <img src={`${process.env.PUBLIC_URL}/front-arrow.png`} alt="See all" className="see-all-icon" />
              </div>
            </div>
            <div className="panel-frame">
              <ul className="user-list">
                {Array.from({ length: 10 }).map((_, index) => (
                  <li key={index} className="user-item">
                    <img src={`${process.env.PUBLIC_URL}/profile-picture.png`} alt="Profile" className="profile-picture" />
                    <span className="username">New User {index + 1}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="panel-section leaderboard">
            <div className="panel-header">
              <h3 className="panel-title">Leaderboard</h3>
              <div className="panel-action">
                <span className="see-all">See all</span>
                <img src={`${process.env.PUBLIC_URL}/front-arrow.png`} alt="See all" className="see-all-icon" />
              </div>
            </div>
            <div className="panel-frame">
              <ul className="user-list">
                {Array.from({ length: 10 }).map((_, index) => (
                  <li key={index} className="user-item">
                    <img src={`${process.env.PUBLIC_URL}/profile-picture.png`} alt="Profile" className="profile-picture" />
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

export default Dashboard;

// import React, { useEffect, useRef, useState } from 'react';
// import NavigationPanel from '../components/NavigationPanel';
// import AppBar from '../components/AppBar';
// import './Dashboard.css';
// import { Chart, registerables } from 'chart.js';

// Chart.register(...registerables);

// const Dashboard = () => {
//   const recentActivitiesChartRef = useRef(null);
//   const userLevelChartRef = useRef(null);
//   const walletConnectionChartRef = useRef(null);
//   const [dashboardData, setDashboardData] = useState(null);

//   useEffect(() => {
//     // Fetch data from backend
//     fetch('/api/dashboard-data')
//       .then(response => response.json())
//       .then(data => setDashboardData(data))
//       .catch(error => console.error('Error fetching dashboard data:', error));

//     // Recent Activities Line Chart
//     const ctx = document.getElementById('recent-activities-graph').getContext('2d');

//     if (recentActivitiesChartRef.current) {
//       recentActivitiesChartRef.current.destroy();
//     }

//     recentActivitiesChartRef.current = new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//         datasets: [
//           {
//             label: 'Total Coin Earned',
//             data: dashboardData ? dashboardData.totalCoinEarnedMonthly : [],
//             borderColor: 'orange',
//             borderWidth: 1,
//             fill: false,
//             tension: 0.0,
//           },
//           {
//             label: 'Total Users',
//             data: dashboardData ? dashboardData.totalUsersMonthly : [],
//             borderColor: 'green',
//             borderWidth: 1,
//             fill: false,
//             tension: 0.1,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//           x: {
//             title: {
//               display: true,
//               text: 'Months',
//             },
//           },
//           y: {
//             title: {
//               display: true,
//               text: 'Millions',
//             },
//             ticks: {
//               callback: (value) => `${value}M`,
//             },
//           },
//         },
//       },
//     });

//     // User Level Bar Chart
//     const userLevelCtx = document.getElementById('user-level-chart').getContext('2d');

//     if (userLevelChartRef.current) {
//       userLevelChartRef.current.destroy();
//     }

//     userLevelChartRef.current = new Chart(userLevelCtx, {
//       type: 'bar',
//       data: {
//         labels: [
//           'Novice',
//           'Explorer',
//           'Apprentice',
//           'Warrior',
//           'Master',
//           'Champion',
//           'Tactician', 
//           'Specialist',
//           'Conqueror',
//           'Legend'
//         ],
//         datasets: [{
//           label: 'Number of Users (in Millions)',
//           data: dashboardData ? dashboardData.userLevels : [],
//           backgroundColor: '#79797A',
//           borderColor: '#79797A',
//           borderWidth: 25,
//           borderRadius: 4,
//           barPercentage: 0.6, // Increased from 0.25 to make bars wider
//           categoryPercentage: 0.8 // Added to increase bar width
//         }],
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//           x: {
//             ticks: {
//               maxRotation: 0, // Changed from 45 to 0 for horizontal labels
//               minRotation: 0  // Changed from 45 to 0 for horizontal labels
//             }
//           },
//           y: {
//             beginAtZero: true,
//             ticks: {
//               callback: function(value) {
//                 return value + 'M';
//               }
//             }
//           }
//         },
//         plugins: {
//           legend: {
//             display: false,
//           },
//         },
//       },
//     });

//     // Wallet Connection Doughnut Chart
//     const walletConnectionCtx = document.getElementById('wallet-connection-chart').getContext('2d');

//     if (walletConnectionChartRef.current) {
//       walletConnectionChartRef.current.destroy();
//     }

//     walletConnectionChartRef.current = new Chart(walletConnectionCtx, {
//       type: 'doughnut',
//       data: {
//         labels: ['Wallet Connected', 'No Wallet Connected'],
//         datasets: [{
//           data: dashboardData ? dashboardData.walletConnections : [],
//           backgroundColor: ['#00FF00', '#FF0000'], // Green and Red
//           borderWidth: 5, // Increased border width for a thicker line
//         }],
//       },
      
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         cutout: '50%', // Reduced cutout to make donut fatter
//         plugins: {
//           legend: {
//             display: false,
//           },
//         },
//       },
//     });

//     // Cleanup charts when component unmounts
//     return () => {
//       if (recentActivitiesChartRef.current) {
//         recentActivitiesChartRef.current.destroy();
//       }
//       if (userLevelChartRef.current) {
//         userLevelChartRef.current.destroy();
//       }
//       if (walletConnectionChartRef.current) {
//         walletConnectionChartRef.current.destroy();
//       }
//     };
//   }, [dashboardData]);

//   if (!dashboardData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="dashboard">
//       <NavigationPanel />
//       <div className="main-wrapper">
//         <AppBar screenName="Dashboard" />
//         <div className="main-content">
//           <div className="overview-section">
//             <h2 className="overview-title">Overview</h2>
//             <div className="data-frames">

//               {/* Frame 1: Total Users */}
//               <div className="data-frame">
//                 <div className="frame-header">
//                   <img src={`${process.env.PUBLIC_URL}/invite.png`} alt="Total Users" className="frame-icon" />
//                   <span className="frame-percentage increment">
//                     +{dashboardData.totalUsersPercentage}%
//                     <img src={`${process.env.PUBLIC_URL}/ArrowRise.png`} alt="Increment" className="frame-percentage-icon" />
//                   </span>
//                 </div>
//                 <div className="frame-value">{dashboardData.totalUsers}</div>
//                 <div className="frame-title">Total Users</div>
//               </div>

//               {/* Frame 2: Total New Users */}
//               <div className="data-frame">
//                 <div className="frame-header">
//                   <img src={`${process.env.PUBLIC_URL}/invite.png`} alt="New Users" className="frame-icon" />
//                   <span className="frame-percentage increment">
//                     +{dashboardData.newUsersPercentage}%
//                     <img src={`${process.env.PUBLIC_URL}/ArrowRise.png`} alt="Increment" className="frame-percentage-icon" />
//                   </span>
//                 </div>
//                 <div className="frame-value">{dashboardData.newUsers}</div>
//                 <div className="frame-title">Total New Users</div>
//               </div>

//               {/* Frame 3: Total Coin Earned */}
//               <div className="data-frame">
//                 <div className="frame-header">
//                   <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Total Coin Earned" className="frame-icon" />
//                   <span className="frame-percentage decrement">
//                     -{dashboardData.totalCoinEarnedPercentage}%
//                     <img src={`${process.env.PUBLIC_URL}/ArrowFall.png`} alt="Decrement" className="frame-percentage-icon" />
//                   </span>
//                 </div>
//                 <div className="frame-value">{dashboardData.totalCoinEarned}</div>
//                 <div className="frame-title">Total Coin Earned</div>
//               </div>

//               {/* Frame 4: Token Distributed */}
//               <div className="data-frame">
//                 <div className="frame-header">
//                   <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Token Distributed" className="frame-icon" />
//                   <span className="frame-percentage increment">
//                     +{dashboardData.tokenDistributedPercentage}%
//                     <img src={`${process.env.PUBLIC_URL}/ArrowRise.png`} alt="Increment" className="frame-percentage-icon" />
//                   </span>
//                 </div>
//                 <div className="frame-value">{dashboardData.tokenDistributed}</div>
//                 <div className="frame-title">Token Distributed</div>
//               </div>
//             </div>
//           </div>

//           {/* Recent Activities Section */}
//           <div className="recent-activities big-frame">
//             <h2 className="section-title">Recent Activities</h2>
//             <div className="recent-activities-header">
//               <div className="pagination">
//                 <span className="active">Total Coin Earned</span>
//                 <span className="separator">|</span>
//                 <span className="inactive">Total Users</span>
//               </div>
//               <div className="time-filters">
//                 <span className="active">This Year</span>
//                 <span className="separator">|</span>
//                 <span className="inactive">Last Year</span>
//               </div>
//             </div>
//             <div className="graph-container">
//               <canvas id="recent-activities-graph"></canvas>
//             </div>
//           </div>

//           {/* User Level and Wallet Connection Section */}
//           <div className="user-level-wallet-section">
//             <div className="user-level-frame">
//               <h2 className="section-title">User Level</h2>
//               <div className="small-frame">
//                 <canvas id="user-level-chart"></canvas>
//               </div>
//             </div>
//             <div className="wallet-connection-frame">
//               <h2 className="section-title">Wallet Connection</h2>
//               <div className="small-frame">
//                 <canvas id="wallet-connection-chart"></canvas>
//                 <div className="wallet-connection-legend">
//                   <div className="legend-item">
//                     <span className="dot green"></span>
//                     <span className="legend-text">Wallet Connected</span>
//                   </div>
//                   <div className="legend-item">
//                     <span className="dot red"></span>
//                     <span className="legend-text">No Wallet Connected</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Other sections of the dashboard */}
//         </div>
//         <div className="right-panel">
//           <div className="panel-section new-users">
//             <div className="panel-header">
//               <h3 className="panel-title">New Users</h3>
//               <div className="panel-action">
//                 <span className="see-all">See all</span>
//                 <img src={`${process.env.PUBLIC_URL}/front-arrow.png`} alt="See all" className="see-all-icon" />
//               </div>
//             </div>
//             <div className="panel-frame">
//               <ul className="user-list">
//                 {dashboardData.newUsersList.map((user, index) => (
//                   <li key={index} className="user-item">
//                     <img src={`${process.env.PUBLIC_URL}/profile-picture.png`} alt="Profile" className="profile-picture" />
//                     <span className="username">{user}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           <div className="panel-section leaderboard">
//             <div className="panel-header">
//               <h3 className="panel-title">Leaderboard</h3>
//               <div className="panel-action">
//                 <span className="see-all">See all</span>
//                 <img src={`${process.env.PUBLIC_URL}/front-arrow.png`} alt="See all" className="see-all-icon" />
//               </div>
//             </div>
//             <div className="panel-frame">
//               <ul className="user-list">
//                 {dashboardData.leaderboardList.map((leader, index) => (
//                   <li key={index} className="user-item">
//                     <img src={`${process.env.PUBLIC_URL}/profile-picture.png`} alt="Profile" className="profile-picture" />
//                     <span className="username">{leader}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
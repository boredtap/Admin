import React, { useState } from 'react';
import NavigationPanel from '../components/NavigationPanel';
import AppBar from '../components/AppBar';
import UserProfileOverlay from '../components/UserProfileOverlay';
import "react-datepicker/dist/react-datepicker.css";
import './Leaderboard.css';

const Leaderboard = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeTab, setActiveTab] = useState("All Time"); // Updated tab names
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCreateOverlay, setShowCreateOverlay] = useState(false);
  const [filters, setFilters] = useState({
    level: {
      'Novice': false,
      'Explorer': false,
      'Apprentice': false,
      'Warrior': false,
      'Master': false,
      'Champion': false,
      'Tactician': false,
      'Specialist': false,
      'Conqueror': false,
      'Legend': false
    }
  });

  // Sample data for Leaderboard
  const sampleData = {
    "All Time": Array(25).fill({
      rank: "#1",
      username: "AjoseD28",
      level: "Legend",
      coinEarned: "7,127,478,606",
      clan: "TON Station",
      highestStreak: "16-12-2024"
    }),
    "Daily": Array(15).fill({
      rank: "#2",
      username: "User1",
      level: "Master",
      coinEarned: "1,000,000",
      clan: "Daily Warriors",
      highestStreak: "17-12-2024"
    }),
    "Weekly": Array(10).fill({
      rank: "#3",
      username: "User2",
      level: "Conqueror",
      coinEarned: "500,000",
      clan: "Weekly Wonders",
      highestStreak: "18-12-2024"
    }),
    "Monthly": Array(10).fill({
      rank: "#4",
      username: "User3",
      level: "Specialist",
      coinEarned: "100,000",
      clan: "Monthly Masters",
      highestStreak: "19-12-2024"
    }),
  };

  const formatDate = (date) => {
    if (!date) return 'DD-MM-YYYY';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Custom date picker functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const changeMonth = (offset) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  const CustomDatePicker = () => {
    const days = getDaysInMonth(currentMonth);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];

    return (
      <div className="custom-date-picker">
        <div className="date-picker-header">
          <button onClick={() => changeMonth(-1)}>&lt;</button>
          <span>{months[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
          <button onClick={() => changeMonth(1)}>&gt;</button>
        </div>
        <div className="weekdays">
          {weekDays.map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        <div className="days-grid">
          {days.map((date, index) => (
            <div
              key={index}
              className={`day ${date ? 'valid-day' : ''} ${
                selectedDate && date && 
                date.toDateString() === selectedDate.toDateString() ? 'selected' : ''
              }`}
              onClick={() => date && handleDateSelect(date)}
            >
              {date ? date.getDate() : ''}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleFilterClick = (event) => {
    event.stopPropagation();
    setShowFilterDropdown(!showFilterDropdown);
  };

  const handleFilterChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [value]: !prev[category][value]
      }
    }));
  };

  const clearFilters = () => {
    setFilters({
      level: {
        'Novice': false,
        'Explorer': false,
        'Apprentice': false,
        'Warrior': false,
        'Master': false,
        'Champion': false,
        'Tactician': false,
        'Specialist': false,
        'Conqueror': false,
        'Legend': false
      }
    });
  };

  const handleRadioClick = (index, event) => {
    event.stopPropagation();
    setSelectedRow(index === selectedRow ? null : index);
  };

  const handleActionClick = (index, event) => {
    event.stopPropagation();
    setShowActionDropdown(showActionDropdown === index ? null : index);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedRow(null);
    setShowActionDropdown(null);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = Math.ceil(sampleData[activeTab].length / rowsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="leaderboard-page">
      <NavigationPanel />
      <div className="main-wrapper">
        <AppBar screenName="Leaderboard" />
        <div className="leaderboard-body-frame">
          <div className="leaderboard-header">
            <div className="leaderboard-pagination">
              {["All Time", "Daily", "Weekly", "Monthly"].map(tab => (
                <span 
                  key={tab} 
                  className={`pagination-item ${activeTab === tab ? "active" : ""}`} 
                  onClick={() => handleTabChange(tab)}
                >
                  {tab}
                </span>
              ))}
            </div>
            <div className="leaderboard-buttons">
              <button className="btn export-btn">
                <img src={`${process.env.PUBLIC_URL}/download.png`} alt="Export" className="btn-icon" />
                Export
              </button>
              <button className="btn suspend-btn" onClick={() => setShowCreateOverlay(true)}>
                <img src={`${process.env.PUBLIC_URL}/stop.png`} alt="Suspend" className="btn-icon" />
                Suspend
              </button>
            </div>
          </div>

          <div className="leaderboard-divider"></div>

          {/* Search Bar and Buttons */}
          <div className="leaderboard-toolbar">
            <div className="search-bar">
              <img src={`${process.env.PUBLIC_URL}/search.png`} alt="Search" className="search-icon" />
              <input type="text" placeholder="Search by username, clan..." className="search-input" />
              <img 
                src={`${process.env.PUBLIC_URL}/filter.png`} 
                alt="Filter" 
                className="filter-icon"
                onClick={handleFilterClick}
              />
              {showFilterDropdown && (
                <div className="filter-dropdown">
                  <div className="filter-section">
                    <div className="filter-header" onClick={() => setFilters(prev => ({ ...prev, showLevel: !prev.showLevel }))}>
                      <span>Level</span>
                      <img src={`${process.env.PUBLIC_URL}/dropdown.png`} alt="Dropdown" />
                    </div>
                    {filters.showLevel && (
                      <div className="filter-options">
                        {Object.keys(filters.level).map(level => (
                          <label key={level} className="filter-option">
                            <input
                              type="checkbox"
                              checked={filters.level[level]}
                              onChange={() => handleFilterChange('level', level)}
                            />
                            <span>{level}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className="clear-filters" onClick={clearFilters}>
                    <span>Clear selection</span>
                  </button>
                </div>
              )}
            </div>
            <div className="toolbar-buttons">
              <div className="date-picker-wrapper">
                <button className="btn date-btn" onClick={() => setShowDatePicker(!showDatePicker)}>
                  <img src={`${process.env.PUBLIC_URL}/date.png`} alt="Date" className="btn-icon" />
                  {formatDate(selectedDate)}
                </button>
                {showDatePicker && (
                  <div className="date-picker-container">
                    <CustomDatePicker />
                  </div>
                )}
              </div>
              <button className="btn delete-btn">
                <img src={`${process.env.PUBLIC_URL}/delete.png`} alt="Delete" className="btn-icon" />
                Delete
              </button>
            </div>
          </div>

          <div className="leaderboard-divider"></div>

          <div className="leaderboard-table-header">
            <div className="table-heading radio-column">
              <div className="custom-radio"></div>
            </div>
            <div className="table-heading">Rank</div>
            <div className="table-heading">Username</div>
            <div className="table-heading">Level</div>
            <div className="table-heading">Coin Earned</div>
            <div className="table-heading">Clan</div>
            <div className="table-heading">Highest Streak</div>
            <div className="table-heading action-heading"> 
              <span>Action</span>
            </div>
          </div>

          <div className="leaderboard-divider"></div>

          {/* Table Rows */}
          {sampleData[activeTab].slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((user, index) => (
            <div key={index} className={`leaderboard-table-row ${selectedRow === index ? "selected" : ""}`}>
              <div className="table-cell radio-column" onClick={(e) => handleRadioClick(index, e)}>
                <div className={`custom-radio ${selectedRow === index ? "selected" : ""}`}></div>
              </div>
              <div className="table-cell">{user.rank}</div>
              <div className="table-cell">{user.username}</div>
              <div className="table-cell">{user.level}</div>
              <div className="table-cell">{user.coinEarned}</div>
              <div className="table-cell">{user.clan}</div>
              <div className="table-cell">{user.highestStreak}</div>
              <div className="table-cell action-cell" onClick={(e) => handleActionClick(index, e)}>
                <span>Action</span>
                <img src={`${process.env.PUBLIC_URL}/dropdown.png`} alt="Dropdown" className="dropdown-icon" />
                {showActionDropdown === index && (
                  <div className="action-dropdown">
                    <div className="dropdown-item">
                      <img src={`${process.env.PUBLIC_URL}/edit.png`} alt="Edit" className="action-icon" />
                      <span>Edit</span>
                    </div>
                    <div className="dropdown-item">
                      <img src={`${process.env.PUBLIC_URL}/deletered.png`} alt="Delete" className="action-icon" />
                      <span>Delete</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="leaderboard-divider"></div>

          {/* Footer with Pagination */}
          <div className="table-footer">
            <div className="rows-per-page">
              <span>Show Result:</span>
              <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div className="pagination-controls">
              <img
                src={`${process.env.PUBLIC_URL}/back-arrow.png`}
                alt="Previous"
                className="pagination-arrow"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              />
              <div className="page-numbers">
                {pageNumbers.map(num => (
                  <span
                    key={num}
                    className={`page-number ${currentPage === num ? 'active' : ''}`}
                    onClick={() => setCurrentPage(num)}
                  >
                    {num}
                  </span>
                ))}
              </div>
              <img
                src={`${process.env.PUBLIC_URL}/front-arrow.png`}
                alt="Next"
                className="pagination-arrow"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
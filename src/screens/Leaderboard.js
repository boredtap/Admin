// Leaderboard.js
import React, { useState, useEffect } from 'react';
import NavigationPanel from '../components/NavigationPanel'; // Corrected path
import AppBar from '../components/AppBar'; // Corrected path
import * as XLSX from 'xlsx';
import "react-datepicker/dist/react-datepicker.css";
import './Leaderboard.css';

const Leaderboard = () => {
  // ... (rest of your code)
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeTab, setActiveTab] = useState("All Time");
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
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

  const [leaderboardData, setLeaderboardData] = useState({
    "All Time": [],
    "Daily": [],
    "Weekly": [],
    "Monthly": []
  });

  useEffect(() => {
    fetchLeaderboardData(activeTab);
  }, [activeTab]);

  const fetchLeaderboardData = async (category) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error("No access token found");
        return;
      }

      const url = `https://bored-tap-api.onrender.com/admin/leaderboard/?category=${category.toLowerCase().replace(" ", "_")}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch leaderboard: ${response.status}`);

      const data = await response.json();
      setLeaderboardData(prev => ({
        ...prev,
        [category]: data
      }));
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    }
  };
  
  const formatDate = (date) => {
    if (!date) return 'DD-MM-YYYY';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

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
          <button onClick={() => changeMonth(-1)}></button>
          <span>{months[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
          <button onClick={() => changeMonth(1)}></button>
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

  const handleRowClick = (index, event) => {
    event.stopPropagation();
    setSelectedRows(prev => {
      if (prev.includes(index)) {
        return prev.filter(row => row !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleActionClick = (index, event) => {
    event.stopPropagation();
    setShowActionDropdown(showActionDropdown === index ? null : index);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedRows([]);
    setShowActionDropdown(null);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handleDelete = () => {
    const updatedData = leaderboardData[activeTab].filter((_, index) => !selectedRows.includes(index));
    setLeaderboardData(prev => ({
      ...prev,
      [activeTab]: updatedData
    }));
    setSelectedRows([]);
  };

  const handleExport = () => {
    const dataToExport = filteredData.map(user => ({
      'Rank': user.rank,
      'Username': user.username,
      'Level': user.level,
      'Level Name': user.level_name,
      'Coins Earned': user.coins_earned,
      'Clan': user.clan,
      'Longest Streak': user.longest_streak,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leaderboard');
    XLSX.writeFile(workbook, 'leaderboard.xlsx');
  };

  const filteredData = leaderboardData[activeTab]?.filter(user => {
    const levelMatch = Object.keys(filters.level).some(level => filters.level[level] && user.level_name === level);
    return (!Object.values(filters.level).includes(true) || levelMatch);
  }) || [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
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
              <button className="btn export-btn" onClick={handleExport}>
                <img src={`${process.env.PUBLIC_URL}/download.png`} alt="Export" className="btn-icon" />
                Export
              </button>
              <button className="btn suspend-btn">
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
              <button className="btn delete-btn" onClick={handleDelete}>
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
            <div className="table-heading">Longest Streak</div>
            <div className="table-heading action-heading"> 
              <span>Action</span>
            </div>
          </div>

          <div className="leaderboard-divider"></div>

          {/* Table Rows */}
          {filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((user, index) => (
            <div key={index} className={`leaderboard-table-row ${selectedRows.includes(index) ? "selected" : ""}`} onClick={(e) => handleRowClick(index, e)}>
              <div className="table-cell radio-column">
                <div className={`custom-radio ${selectedRows.includes(index) ? "selected" : ""}`}></div>
              </div>
              <div className="table-cell">{user.rank}</div>
              <div className="table-cell">{user.username}</div>
              <div className="table-cell">{user.level_name}</div>
              <div className="table-cell coin-cell"> <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="coin" className="coin-icon" />
                {user.coins_earned}</div>
              <div className="table-cell">{user.clan}</div>
              <div className="table-cell">{user.longest_streak}</div>
              <div className="table-cell action-cell" onClick={(e) => handleActionClick(index, e)}>
                <span>Action</span>
                <img src={`${process.env.PUBLIC_URL}/dropdown.png`} alt="Dropdown" className="dropdown-icon" />
                {showActionDropdown === index && (
                  <div className="action-dropdown">
                    <div className="dropdown-item">
                      <img src={`${process.env.PUBLIC_URL}/edit.png`} alt="Edit" className="action-icon" />
                      <span>Edit</span>
                    </div>
                    <div className="dropdown-item" onClick={handleDelete}>
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
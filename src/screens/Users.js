import React, { useState, useEffect } from 'react';
import NavigationPanel from '../components/NavigationPanel';
import AppBar from '../components/AppBar';
import * as XLSX from 'xlsx';
import "react-datepicker/dist/react-datepicker.css";
import './Users.css';

const Users = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState(null); // Keep error for handling fetch errors
  const [activeTab, setActiveTab] = useState("All Users");
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filters, setFilters] = useState({
    status: {
      Active: false,
      Suspended: false,
      Disband: false
    },
    level: {
      'Novice-Lv 1': false,
      'Explorer-Lv 2': false,
      'Apprentice-Lv 3': false,
      'Warrior-Lv 4': false,
      'Master - Lv 5': false,
      'Champion - Lv 6': false,
      'Tactician- Lv 7': false,
      'Specialist - Lv 8': false,
      'Conqueror -Lv 9': false,
      'Legend - Lv 10': false
    }
  });

  const [usersData, setUsersData] = useState({
    "All Users": [],
    "Top 1000": []
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        const response = await fetch("https://bt-coins.onrender.com/admin/user_management/users", {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        setUsersData(prev => ({
          ...prev,
          "All Users": data,
          "Top 1000": data.slice(0, 1000)
        }));
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'DD-MM-YYYY';
    const date = new Date(dateStr);
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
      status: {
        Active: false,
        Suspended: false,
        Disband: false
      },
      level: {
        'Novice-Lv 1': false,
        'Explorer-Lv 2': false,
        'Apprentice-Lv 3': false,
        'Warrior-Lv 4': false,
        'Master - Lv 5': false,
        'Champion - Lv 6': false,
        'Tactician- Lv 7': false,
        'Specialist - Lv 8': false,
        'Conqueror -Lv 9': false,
        'Legend - Lv 10': false
      }
    });
  };

  const handleRowClick = (index, event) => {
    event.stopPropagation();
    setSelectedRows(prev => 
      prev.includes(index) ? prev.filter(row => row !== index) : [...prev, index]
    );
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
    const updatedData = usersData[activeTab].filter((_, index) => !selectedRows.includes(index));
    setUsersData(prev => ({
      ...prev,
      [activeTab]: updatedData
    }));
    setSelectedRows([]);
  };

  const handleExport = () => {
    const dataToExport = usersData[activeTab].map(user => ({
      'Telegram ID': user.telegram_user_id,
      'Username': user.username,
      'Level': `${user.level} - ${user.level_name}`,
      'Coins Earned': user.coins_earned,
      'Invite Count': user.invite_count,
      'Registration Date': formatDate(user.registration_date),
      'Status': user.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'users.xlsx');
  };

  const filteredData = usersData[activeTab].filter(user => {
    const statusMatch = Object.keys(filters.status).some(status => 
      filters.status[status] && user.status.toLowerCase() === status.toLowerCase());
    const levelMatch = Object.keys(filters.level).some(level => 
      filters.level[level] && user.level_name.toLowerCase().includes(level.toLowerCase().split('-')[0]));
    return (!Object.values(filters.status).some(v => v) || statusMatch) &&
           (!Object.values(filters.level).some(v => v) || levelMatch);
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="user-management-page">
      <NavigationPanel />
      <div className="main-wrapper">
        <AppBar screenName="Users" />
        {error && <div>Error: {error}</div>} {/* Only show error if it exists */}
        <div className="user-management-body-frame">
          <div className="user-management-header">
            <div className="user-management-pagination">
              {["All Users", "Top 1000"].map(tab => (
                <span 
                  key={tab} 
                  className={`pagination-item ${activeTab === tab ? "active" : ""}`} 
                  onClick={() => handleTabChange(tab)}
                >
                  {tab}
                </span>
              ))}
            </div>
            <div className="user-management-buttons">
              <button className="btn export-btn" onClick={handleExport}>
                <img src={`${process.env.PUBLIC_URL}/download.png`} alt="Export" className="btn-icon" />
                Export
              </button>
            </div>
          </div>

          <div className="user-management-divider"></div>

          <div className="user-management-toolbar">
            <div className="search-bar">
              <img src={`${process.env.PUBLIC_URL}/search.png`} alt="Search" className="search-icon" />
              <input type="text" placeholder="Search by name, status...." className="search-input" />
              <img 
                src={`${process.env.PUBLIC_URL}/filter.png`} 
                alt="Filter" 
                className="filter-icon"
                onClick={handleFilterClick}
              />
              {showFilterDropdown && (
                <div className="filter-dropdown">
                  <div className="filter-section">
                    <div className="filter-header" onClick={() => setFilters(prev => ({ ...prev, showStatus: !prev.showStatus }))}>
                      <span>Status</span>
                      <img src={`${process.env.PUBLIC_URL}/dropdown.png`} alt="Dropdown" />
                    </div>
                    {filters.showStatus && (
                      <div className="filter-options">
                        {Object.keys(filters.status).map(status => (
                          <label key={status} className="filter-option">
                            <input
                              type="checkbox"
                              checked={filters.status[status]}
                              onChange={() => handleFilterChange('status', status)}
                            />
                            <span>{status}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
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

          <div className="user-management-divider"></div>

          <div className="user-management-table-header">
            <div className="table-heading radio-column">
              <div className="custom-radio"></div>
            </div>
            <div className="table-heading">User Name</div>
            <div className="table-heading">Level</div>
            <div className="table-heading">Coin Earned</div>
            <div className="table-heading">Invite Count</div>
            <div className="table-heading">Registration Date</div>
            <div className="table-heading">Status</div>
            <div className="table-heading action-heading">Action</div>
          </div>

          <div className="user-management-divider"></div>

          {filteredData.length === 0 ? (
            <div>No users to display</div>
          ) : (
            filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((user, index) => (
              <div
                key={index}
                className={`user-management-table-row ${selectedRows.includes(index) ? "selected" : ""}`}
                onClick={(e) => handleRowClick(index, e)}
              >
                <div className="table-cell radio-column">
                  <div className={`custom-radio ${selectedRows.includes(index) ? "selected" : ""}`}></div>
                </div>
                <div className="table-cell">{user.username}</div>
                <div className="table-cell">{user.level_name}</div>
                <div className="table-cell reward-cell">
                  <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Coin" className="reward-icon" />
                  {user.coins_earned}
                </div>
                <div className="table-cell">{user.invite_count}</div>
                <div className="table-cell">{formatDate(user.registration_date)}</div>
                <div className="table-cell">
                  <span className={`status-btn ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </div>
                <div className="table-cell action-cell" onClick={(e) => handleActionClick(index, e)}>
                  <span>Action</span>
                  <img src={`${process.env.PUBLIC_URL}/dropdown.png`} alt="Dropdown" className="dropdown-icon" />
                  {showActionDropdown === index && (
                    <div className="action-dropdown">
                      <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); /* Handle Edit */ }}>
                        <img src={`${process.env.PUBLIC_URL}/edit.png`} alt="Edit" className="action-icon" />
                        <span>Edit</span>
                      </div>
                      <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
                        <img src={`${process.env.PUBLIC_URL}/deletered.png`} alt="Delete" className="action-icon" />
                        <span>Delete</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          <div className="user-management-divider"></div>

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

export default Users;
import React, { useState } from 'react';
import NavigationPanel from '../components/NavigationPanel';
import AppBar from '../components/AppBar';
// import CreateClanChallengeOverlay from '../components/CreateClanChallengeOverlay'; // Renamed
import "react-datepicker/dist/react-datepicker.css";
import './Clans.css'; // Assuming you rename the CSS file too

const Clans = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeTab, setActiveTab] = useState("All Clans"); // Updated tab names
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCreateClanChallengeOverlay, setShowCreateClanChallengeOverlay] = useState(false); // Updated
  const [filters, setFilters] = useState({
    status: {
      Active: false,
      Pending: false,
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

  // Sample data for Clans
  const sampleData = {
    "All Clans": Array(25).fill({ // Increased to 25 to simulate more pages
      name: "TON Station",
      creator: "Ridwan007",
      rank: "#1",
      coins: { icon: "coin.png", value: 67127478 },
      creationDate: "19/12/2024",
      status: "Active",
    }),
    "Active": Array(15).fill({
      name: "Active Clan",
      creator: "User1",
      rank: "#2",
      coins: { icon: "coin.png", value: 1000000 },
      creationDate: "20/12/2024",
      status: "Active",
    }),
    "Pending Approval": Array(5).fill({
      name: "Pending Clan",
      creator: "User2",
      rank: "#3",
      coins: { icon: "coin.png", value: 500000 },
      creationDate: "21/12/2024",
      status: "Pending",
    }),
    "Disband": Array(5).fill({
      name: "Disbanded Clan",
      creator: "User3",
      rank: "#4",
      coins: { icon: "coin.png", value: 100000 },
      creationDate: "22/12/2024",
      status: "Disband",
    }),
  };

  // Rest of the component logic would remain similar, with modifications for clan context
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
      status: {
        Active: false,
        Pending: false,
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
    const updatedData = sampleData[activeTab].filter((_, index) => !selectedRows.includes(index));
    sampleData[activeTab] = updatedData;
    setSelectedRows([]);
  };

  const filteredData = sampleData[activeTab].filter(clan => {
    const statusMatch = Object.keys(filters.status).some(status => filters.status[status] && clan.status === status);
    const levelMatch = Object.keys(filters.level).some(level => filters.level[level] && clan.rank.includes(level));
    return (!Object.values(filters.status).includes(true) || statusMatch) &&
           (!Object.values(filters.level).includes(true) || levelMatch);
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="clans-page">
      <NavigationPanel />
      <div className="main-wrapper">
        <AppBar screenName="Clans" />
        <div className="clans-body-frame">
          {/* Pagination Section */}
          <div className="clans-header">
            <div className="clans-pagination">
              {["All Clans", "Active", "Pending Approval", "Disband"].map(tab => (
                <span 
                  key={tab} 
                  className={`pagination-item ${activeTab === tab ? "active" : ""}`} 
                  onClick={() => handleTabChange(tab)}
                >
                  {tab}
                </span>
              ))}
            </div>
            <div className="clans-buttons">
              <button className="btn export-btn">
                <img src={`${process.env.PUBLIC_URL}/download.png`} alt="Export" className="btn-icon" />
                Export
              </button>
              <button className="btn create-btn" onClick={() => setShowCreateClanChallengeOverlay(true)}>
                <img src={`${process.env.PUBLIC_URL}/add.png`} alt="Create Clan Challenge" className="btn-icon" />
                Clan Challenge
              </button>
            </div>
          </div>

          <div className="clans-divider"></div>

          {/* Search Bar and Buttons */}
          <div className="clans-toolbar">
            <div className="search-bar">
              <img src={`${process.env.PUBLIC_URL}/search.png`} alt="Search" className="search-icon" />
              <input type="text" placeholder="Search by type, status...." className="search-input" />
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

          <div className="clans-divider"></div>

          {/* Table Header */}
          <div className="clans-table-header">
            <div className="table-heading radio-column">
              <div className="custom-radio"></div>
            </div>
            <div className="table-heading">Clan Name</div>
            <div className="table-heading">Owner or Creator</div>
            <div className="table-heading">Clan Rank</div>
            <div className="table-heading">Total Coin</div>
            <div className="table-heading">Creation Date</div>
            <div className="table-heading">Status</div>
            <div className="table-heading action-heading"> 
              <span>Action</span>
            </div>
          </div>

          <div className="clans-divider"></div>

          {/* Table Rows */}
          {filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((clan, index) => (
            <div
              key={index}
              className={`clans-table-row ${selectedRows.includes(index) ? "selected" : ""}`}
              onClick={(e) => handleRowClick(index, e)}
            >
              <div className="table-cell radio-column">
                <div className={`custom-radio ${selectedRows.includes(index) ? "selected" : ""}`}></div>
              </div>
              <div className="table-cell">{clan.name}</div>
              <div className="table-cell">{clan.creator}</div>
              <div className="table-cell">{clan.rank}</div>
              <div className="table-cell reward-cell">
                <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Coin" className="reward-icon" />
                {clan.coins.value}
              </div>
              <div className="table-cell">{clan.creationDate}</div>
              <div className="table-cell">
                <span className={`status-btn ${clan.status.toLowerCase()}`}>
                  {clan.status}
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
          ))}

          <div className="clans-divider"></div>

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
          {/* {showCreateClanChallengeOverlay && (
            <CreateClanChallengeOverlay 
              onClose={() => setShowCreateClanChallengeOverlay(false)}
            />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Clans;
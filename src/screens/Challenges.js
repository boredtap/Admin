import React, { useState } from 'react';
import NavigationPanel from '../components/NavigationPanel';
import AppBar from '../components/AppBar';
import CreateChallengeOverlay from '../components/CreateChallengeOverlay';
import "react-datepicker/dist/react-datepicker.css";
import './Challenges.css'; // We'll reuse the same CSS file since structures are similar

const Challenges = () => {
  // State management
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeTab, setActiveTab] = useState("Opened Challenges");
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCreateChallengeOverlay, setShowCreateChallengeOverlay] = useState(false);

  // Filters for Challenges
  const [filters, setFilters] = useState({
    participants: {
      'All Users': false,
      'Selected Users': false,
      'VIP Users': false
    },
    reward: {
      '1000-5000': false,
      '5001-10000': false,
      '10001+': false
    }
  });

  // Sample data structure for Challenges
  const sampleData = {
    "Opened Challenges": [
      {
        challengeName: "Tap Marathon",
        description: "Achieve 50,000 taps within 24hrs.",
        startDate: new Date("2024-12-19"),
        reward: "2,000",
        remainingTime: "10:46:23",
        participants: "All Users"
      },
      {
        challengeName: "Daily Quest Master",
        description: "Complete all daily quests for 7 consecutive days",
        startDate: new Date("2024-12-20"),
        reward: "5,000",
        remainingTime: "23:15:45",
        participants: "VIP Users"
      },
      {
        challengeName: "Social Butterfly",
        description: "Invite 20 friends to join the platform",
        startDate: new Date("2024-12-21"),
        reward: "3,500",
        remainingTime: "15:30:00",
        participants: "All Users"
      }
    ],
    "Completed Challenges": [
      {
        challengeName: "Speed Runner",
        description: "Complete 100 tasks in under 1 hour",
        startDate: new Date("2024-12-15"),
        reward: "4,000",
        remainingTime: "00:00:00",
        participants: "Selected Users"
      },
      {
        challengeName: "Weekend Warrior",
        description: "Maintain top activity for 48 hours",
        startDate: new Date("2024-12-16"),
        reward: "6,000",
        remainingTime: "00:00:00",
        participants: "All Users"
      }
    ]
  };

  // Reusing date formatting function
  const formatDate = (date) => {
    if (!date) return 'DD-MM-YYYY';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Reusing custom date picker functions
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

  // Event handlers
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const changeMonth = (offset) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  // Custom DatePicker component
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

  // Filter handlers
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
      participants: {
        'All Users': false,
        'Selected Users': false,
        'VIP Users': false
      },
      reward: {
        '1000-5000': false,
        '5001-10000': false,
        '10001+': false
      }
    });
  };

  // Row handlers
  const handleRadioClick = (index, event) => {
    event.stopPropagation();
    setSelectedRow(index === selectedRow ? null : index);
  };

  const handleActionClick = (index, event) => {
    event.stopPropagation();
    console.log('Current showActionDropdown:', showActionDropdown);
    setShowActionDropdown(prev => {
      console.log('New showActionDropdown:', prev === index ? null : index);
      return prev === index ? null : index;
    });
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

  // Pagination calculation
  const totalPages = Math.ceil(sampleData[activeTab].length / rowsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="rewards-page">
      <NavigationPanel />
      <div className="main-wrapper">
        <AppBar screenName="Challenges" />
        <div className="rewards-body-frame">
          {/* Pagination Section */}
          <div className="rewards-header">
            <div className="rewards-pagination">
              <span 
                className={`pagination-item ${activeTab === "Opened Challenges" ? "active" : ""}`}
                onClick={() => handleTabChange("Opened Challenges")}
              >
                Opened Challenges
              </span>
              <span 
                className={`pagination-item ${activeTab === "Completed Challenges" ? "active" : ""}`}
                onClick={() => handleTabChange("Completed Challenges")}
              >
                Completed Challenges
              </span>
            </div>
            <div className="rewards-buttons">
              <button className="btn export-btn">
                <img src={`${process.env.PUBLIC_URL}/download.png`} alt="Export" className="btn-icon" />
                Export
              </button>
              <button className="btn create-btn"
               onClick={() => setShowCreateChallengeOverlay(true)}
               >
                <img src={`${process.env.PUBLIC_URL}/add.png`} alt="Create Challenge" className="btn-icon" />
                New Challenge
              </button>
            </div>
          </div>

          <div className="rewards-divider"></div>

          {/* Search and Filter Section */}
          <div className="rewards-toolbar">
            <div className="search-bar">
              <img src={`${process.env.PUBLIC_URL}/search.png`} alt="Search" className="search-icon" />
              <input type="text" placeholder="Search challenges..." className="search-input" />
              <img 
                src={`${process.env.PUBLIC_URL}/filter.png`} 
                alt="Filter" 
                className="filter-icon"
                onClick={handleFilterClick}
              />
              {showFilterDropdown && (
                <div className="filter-dropdown">
                  <div className="filter-section">
                    <div className="filter-header">
                      <span>Participants</span>
                      <img src={`${process.env.PUBLIC_URL}/dropdown.png`} alt="Dropdown" />
                    </div>
                    <div className="filter-options">
                      {Object.keys(filters.participants).map(participant => (
                        <label key={participant} className="filter-option">
                          <input
                            type="checkbox"
                            checked={filters.participants[participant]}
                            onChange={() => handleFilterChange('participants', participant)}
                          />
                          <span>{participant}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section">
                    <div className="filter-header">
                      <span>Reward Range</span>
                      <img src={`${process.env.PUBLIC_URL}/dropdown.png`} alt="Dropdown" />
                    </div>
                    <div className="filter-options">
                      {Object.keys(filters.reward).map(range => (
                        <label key={range} className="filter-option">
                          <input
                            type="checkbox"
                            checked={filters.reward[range]}
                            onChange={() => handleFilterChange('reward', range)}
                          />
                          <span>{range}</span>
                        </label>
                      ))}
                    </div>
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

          <div className="challenges-divider"></div>

          {/* Table Header */}
          <div className="challenges-table-header">
            <div className="table-heading radio-column">
              <div className="custom-radio"></div>
            </div>
            <div className="table-heading">Challenge Name</div>
            <div className="table-heading">Description</div>
            <div className="table-heading">Start Date</div>
            <div className="table-heading">Reward</div>
            <div className="table-heading">Remaining Time</div>
            <div className="table-heading">Participants</div>
            <div className="table-heading action-heading">
              <span>Action</span>
              </div>
          </div>

          <div className="challenges-divider"></div>

          {/* Table Rows */}
            {sampleData[activeTab].map((challenge, index) => (
            <div
                key={index} 
                className={`challenges-table-row ${selectedRow === index ? "selected" : ""}`}
            >
                <div className="table-cell radio-column" onClick={(e) => handleRadioClick(index, e)}>
                <div className={`custom-radio ${selectedRow === index ? "selected" : ""}`}></div>
                </div>
                <div className="table-cell">{challenge.challengeName}</div>
                <div className="table-cell">{challenge.description}</div>
                <div className="table-cell">{formatDate(challenge.startDate)}</div>
                <div className="table-cell reward-cell">
                <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Reward" className="reward-icon" />
                {challenge.reward}
                </div>
                <div className="table-cell">{challenge.remainingTime}</div>
                <div className="table-cell">{challenge.participants}</div>
                <div className="table-cell action-cell" onClick={(e) => handleActionClick(index, e)}>
              <span>Action</span>
              <img src={`${process.env.PUBLIC_URL}/dropdown.png`} alt="Dropdown" className="dropdown-icon" />
              {showActionDropdown === index && (
                <div className="action-dropdown">
                  <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); /* Handle Edit */ }}>
                    <img src={`${process.env.PUBLIC_URL}/edit.png`} alt="Edit" className="action-icon" />
                    <span>Edit</span>
                  </div>
                  <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); /* Handle Delete */ }}>
                    <img src={`${process.env.PUBLIC_URL}/deletered.png`} alt="Delete" className="action-icon" />
                    <span>Delete</span>
                  </div>
                </div>
              )}
            </div>
            </div>
            ))}

          <div className="rewards-divider"></div>

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
          
          {/* Create new reward overlay */}
          {showCreateChallengeOverlay && (
            <CreateChallengeOverlay 
              onClose={() => setShowCreateChallengeOverlay(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Challenges;


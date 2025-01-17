import React, { useState } from 'react';
import NavigationPanel from '../components/NavigationPanel';
import AppBar from '../components/AppBar';
import CreateNewReward from '../components/CreateNewReward';
import "react-datepicker/dist/react-datepicker.css"; 
import './Rewards.css';

const Rewards = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeTab, setActiveTab] = useState("All Rewards");
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCreateNewReward, setShowCreateNewReward] = useState(false);

  const [filters, setFilters] = useState({
    status: {
      'On-going': false,
      'Claimed': false
    },
    beneficiary: {
      'All users': false,
      'Clan': false,
      'Level': false
    }
  });

  const sampleData = {
    "All Rewards": [
      {
        title: "Monthly BT Reward",
        reward: "5,000",
        beneficiary: "All Users",
        launchDate: "25-12-2024",
        status: "On-going",
        claimRate: "81.14",
      },
      {
        title: "Leaderboard Champ",
        reward: "5,000",
        beneficiary: "All Users",
        launchDate: "25-12-2024",
        status: "Claimed",
        claimRate: "81.14",
      },
    ],
    "On-going Rewards": [
      {
        title: "Streak Master",
        reward: "8,000",
        beneficiary: "All Users",
        launchDate: "25-12-2024",
        status: "On-going",
        claimRate: "81.14",
      },
    ],
    "Claimed Rewards": [
      {
        title: "Leaderboard Champ",
        reward: "7,000",
        beneficiary: "All Users",
        launchDate: "25-12-2024",
        status: "Claimed",
        claimRate: "100",
      },
    ],
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
        'On-going': false,
        'Claimed': false
      },
      beneficiary: {
        'All users': false,
        'Clan': false,
        'Level': false
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

  const filteredData = sampleData[activeTab].filter(reward => {
    const statusMatch = Object.keys(filters.status).some(status => filters.status[status] && reward.status === status);
    const beneficiaryMatch = Object.keys(filters.beneficiary).some(beneficiary => filters.beneficiary[beneficiary] && reward.beneficiary === beneficiary);
    return (!Object.values(filters.status).includes(true) || statusMatch) &&
           (!Object.values(filters.beneficiary).includes(true) || beneficiaryMatch);
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="rewards-page">
      <NavigationPanel />
      <div className="main-wrapper">
        <AppBar screenName="Rewards" />
        <div className="rewards-body-frame">
          {/* Pagination Section */}
          <div className="rewards-header">
            <div className="rewards-pagination">
              <span 
                className={`pagination-item ${activeTab === "All Rewards" ? "active" : ""}`} 
                onClick={() => handleTabChange("All Rewards")}
              >
                All Rewards
              </span>
              <span 
                className={`pagination-item ${activeTab === "On-going Rewards" ? "active" : ""}`}
                onClick={() => handleTabChange("On-going Rewards")}
              >
                On-going Rewards
              </span>
              <span 
                className={`pagination-item ${activeTab === "Claimed Rewards" ? "active" : ""}`}
                onClick={() => handleTabChange("Claimed Rewards")}
              >
                Claimed Rewards
              </span>
            </div>
            <div className="rewards-buttons">
              <button className="btn export-btn">
                <img src={`${process.env.PUBLIC_URL}/download.png`} alt="Export" className="btn-icon" />
                Export
              </button>
              <button 
                className="btn create-btn"
                onClick={() => setShowCreateNewReward(true)}
              >
                <img src={`${process.env.PUBLIC_URL}/add.png`} alt="Create Reward" className="btn-icon" />
                New Reward
              </button>
            </div>
          </div>

          <div className="rewards-divider"></div>

          {/* Search and Filter Section */}
          <div className="rewards-toolbar">
            <div className="search-bar">
              <img src={`${process.env.PUBLIC_URL}/search.png`} alt="Search" className="search-icon" />
              <input type="text" placeholder="Search by status, beneficiary...." className="search-input" />
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
                    <div className="filter-header" onClick={() => setFilters(prev => ({ ...prev, showBeneficiary: !prev.showBeneficiary }))}>
                      <span>Beneficiary</span>
                      <img src={`${process.env.PUBLIC_URL}/dropdown.png`} alt="Dropdown" />
                    </div>
                    {filters.showBeneficiary && (
                      <div className="filter-options">
                        {Object.keys(filters.beneficiary).map(beneficiary => (
                          <label key={beneficiary} className="filter-option">
                            <input
                              type="checkbox"
                              checked={filters.beneficiary[beneficiary]}
                              onChange={() => handleFilterChange('beneficiary', beneficiary)}
                            />
                            <span>{beneficiary}</span>
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

          <div className="rewards-divider"></div>

          {/* Table Header */}
          <div className="rewards-table-header">
            <div className="table-heading radio-column">
              <div className="custom-radio"></div>
            </div>
            <div className="table-heading">Reward Title</div>
            <div className="table-heading">Reward</div>
            <div className="table-heading">Beneficiary</div>
            <div className="table-heading">Launch Date</div>
            <div className="table-heading">Status</div>
            <div className="table-heading">Claim Rate</div>
            <div className="table-heading action-heading">
              <span>Action</span>
            </div>
          </div>

          <div className="rewards-divider"></div>

          {/* Table Rows */}
          {filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((reward, index) => (
            <div
              key={index}
              className={`rewards-table-row ${selectedRows.includes(index) ? "selected" : ""}`}
              onClick={(e) => handleRowClick(index, e)}
            >
              <div className="table-cell radio-column">
                <div className={`custom-radio ${selectedRows.includes(index) ? "selected" : ""}`}></div>
              </div>
              <div className="table-cell">{reward.title}</div>
              <div className="table-cell reward-cell">
                <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Reward" className="reward-icon" />
                {reward.reward}
              </div>
              <div className="table-cell">{reward.beneficiary}</div>
              <div className="table-cell">{reward.launchDate}</div>
              <div className="table-cell">
                <span className={`status-btn ${reward.status.toLowerCase()}`}>
                  {reward.status}
                </span>
              </div>
              <div className="table-cell claim-rate-cell">
                {reward.claimRate}%
                <img src={`${process.env.PUBLIC_URL}/ArrowRise.png`} alt="Increment" className="increment-icon" />
              </div>
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
          {showCreateNewReward && (
            <CreateNewReward 
              onClose={() => setShowCreateNewReward(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Rewards;
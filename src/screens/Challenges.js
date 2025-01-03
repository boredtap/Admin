import React, { useState } from 'react';
import NavigationPanel from '../components/NavigationPanel';
import AppBar from '../components/AppBar';
import "react-datepicker/dist/react-datepicker.css";

import './Challenges.css';

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

  // Filters for Challenges
  const [filters, setFilters] = useState({
    status: {
      'Active': false,
      'Completed': false
    },
    participants: {
      'All Users': false,
      'Selected Users': false,
      'VIP Users': false
    }
  });

  // Sample data structure for Challenges
  const sampleData = {
    "Opened Challenges": [
      {
        name: "Top Marathon",
        description: "Achieve 50,000 taps within 24hrs",
        startDate: "19/12/2024",
        reward: "2,000",
        remainingTime: "10:46:23",
        participants: "All Users",
        status: "Active"
      },
      {
        name: "Daily Sprint",
        description: "Complete 100 tasks in 1 hour",
        startDate: "20/12/2024",
        reward: "1,500",
        remainingTime: "23:15:45",
        participants: "VIP Users",
        status: "Active"
      }
    ],
    "Completed Challenges": [
      {
        name: "Weekly Champion",
        description: "Maintain top position for 7 days",
        startDate: "15/12/2024",
        reward: "5,000",
        remainingTime: "00:00:00",
        participants: "All Users",
        status: "Completed"
      },
      {
        name: "Speed Master",
        description: "Complete 500 actions in 2 hours",
        startDate: "18/12/2024",
        reward: "3,000",
        remainingTime: "00:00:00",
        participants: "Selected Users",
        status: "Completed"
      }
    ]
  };

  // Reusing the same date formatting function
  const formatDate = (date) => {
    if (!date) return 'DD-MM-YYYY';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Event handlers
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

  // Pagination calculation
  const totalPages = Math.ceil(sampleData[activeTab].length / rowsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="challenges-page">
      <NavigationPanel />
      <div className="main-wrapper">
        <AppBar screenName="Challenges" />
        <div className="challenges-body-frame">
          {/* Pagination Section */}
          <div className="challenges-header">
            <div className="challenges-pagination">
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
            <div className="challenges-buttons">
              <button className="btn export-btn">
                <img src={`${process.env.PUBLIC_URL}/download.png`} alt="Export" className="btn-icon" />
                Export
              </button>
              <button 
                className="btn create-btn"
              >
                <img src={`${process.env.PUBLIC_URL}/add.png`} alt="Create Challenge" className="btn-icon" />
                New Challenge
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
              <div className="table-cell">{challenge.name}</div>
              <div className="table-cell">{challenge.description}</div>
              <div className="table-cell">{challenge.startDate}</div>
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

          <div className="challenges-divider"></div>

          {/* Footer with Pagination */}
          <div className="table-footer">
            <div className="rows-per-page">
              <span>Show Result:</span>
              <select 
                value={rowsPerPage} 
                onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
              >
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

export default Challenges;
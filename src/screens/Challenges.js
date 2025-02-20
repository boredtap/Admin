import React, { useState, useEffect } from 'react';
import NavigationPanel from '../components/NavigationPanel';
import AppBar from '../components/AppBar';
import CreateChallengeOverlay from '../components/CreateChallengeOverlay';
import * as XLSX from 'xlsx';
import "react-datepicker/dist/react-datepicker.css";
import './Challenges.css';

const Challenges = () => {
  // State management
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeTab, setActiveTab] = useState("Opened Challenges");
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCreateChallengeOverlay, setShowCreateChallengeOverlay] = useState(false);
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

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

  // Challenge data state
  const [challengesData, setChallengesData] = useState({
    "Opened Challenges": [],
    "Completed Challenges": []
  });

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("No access token found");
          return;
        }

        const ongoingResponse = await fetch(
          "https://bt-coins.onrender.com/admin/challenge/get_challenges?status=ongoing",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const completedResponse = await fetch(
          "https://bt-coins.onrender.com/admin/challenge/get_challenges?status=completed",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!ongoingResponse.ok || !completedResponse.ok) {
          throw new Error("Failed to fetch challenges");
        }

        const ongoingData = await ongoingResponse.json();
        const completedData = await completedResponse.json();

        setChallengesData({
          "Opened Challenges": ongoingData,
          "Completed Challenges": completedData,
        });
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
    };

    fetchChallenges();
  }, []);

  const fetchChallengeById = async (challengeId) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const response = await fetch(
        `https://bt-coins.onrender.com/admin/challenge/get_challenge_by_id/${challengeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch challenge details");
      }

      const challenge = await response.json();
      return challenge;
    } catch (error) {
      console.error("Error fetching challenge by ID:", error);
      return null;
    }
  };

  const handleEditChallenge = async (challengeId) => {
    const challenge = await fetchChallengeById(challengeId);
    if (challenge) {
      setSelectedChallenge(challenge);
      setShowCreateChallengeOverlay(true);
    }
  };

  const handleCreateChallengeSubmit = (newChallenge) => {
    setChallengesData(prev => {
      if (isEditing) {
        // Update existing challenge
        return {
          ...prev,
          [activeTab]: prev[activeTab].map(challenge =>
            challenge.id === newChallenge.id ? newChallenge : challenge
          )
        };
      } else {
        // Add new challenge to Opened Challenges
        return {
          ...prev,
          "Opened Challenges": [...prev["Opened Challenges"], newChallenge]
        };
      }
    });
    // Do NOT close the overlay here; let CreateChallengeOverlay handle it
    setSelectedChallenge(null);
  };

  const handleCreateChallenge = () => {
    setSelectedChallenge(null); // Ensure we're creating a new challenge
    setShowCreateChallengeOverlay(true);
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

  const handleDeleteChallenge = (challengeId) => {
    setSelectedChallengeId(challengeId);
    setShowDeleteOverlay(true);
  };

  const confirmDeleteChallenge = async () => {
    if (!selectedChallengeId && selectedRows.length === 0) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      if (selectedChallengeId) {
        await fetch(`https://bt-coins.onrender.com/admin/challenge/delete_challenge/${selectedChallengeId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setChallengesData((prev) => ({
          ...prev,
          [activeTab]: prev[activeTab].filter((challenge) => challenge.id !== selectedChallengeId),
        }));
      } else {
        const challengesToDelete = challengesData[activeTab].filter((_, index) => selectedRows.includes(index));

        for (const challenge of challengesToDelete) {
          await fetch(`https://bt-coins.onrender.com/admin/challenge/delete_challenge/${challenge.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        setChallengesData((prev) => ({
          ...prev,
          [activeTab]: prev[activeTab].filter((_, index) => !selectedRows.includes(index)),
        }));
      }

      alert("Challenge(s) deleted successfully!");
    } catch (error) {
      console.error("Error deleting challenge(s):", error);
    } finally {
      setShowDeleteOverlay(false);
      setSelectedRows([]);
      setSelectedChallengeId(null);
    }
  };

  const handleDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select a challenge to delete.");
      return;
    }

    setShowDeleteOverlay(true);
  };

  const filteredData = challengesData[activeTab].filter(challenge => {
    const participantsMatch = Object.keys(filters.participants).some(participant => filters.participants[participant] && challenge.participants === participant);
    const rewardMatch = Object.keys(filters.reward).some(reward => filters.reward[reward] && challenge.reward.toString().match(new RegExp(reward.replace('-', '-'))));
    return (!Object.values(filters.participants).includes(true) || participantsMatch) &&
           (!Object.values(filters.reward).includes(true) || rewardMatch);
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleExport = () => {
    const dataToExport = filteredData.map(challenge => ({
      'Challenge Name': challenge.name,
      'Description': challenge.description,
      'Start Date': formatDate(new Date(challenge.launch_date)),
      'Reward': challenge.reward,
      'Remaining Time': challenge.remaining_time,
      'Participants': challenge.participants.join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Challenges');
    XLSX.writeFile(workbook, 'challenges.xlsx');
  };

  const isEditing = !!selectedChallenge;

  return (
    <div className="challenges-page">
      <NavigationPanel />
      <div className="main-wrapper">
        <AppBar screenName="Challenges" />
        <div className="challenges-body-frame">
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
              <button className="btn export-btn" onClick={handleExport}>
                <img src={`${process.env.PUBLIC_URL}/download.png`} alt="Export" className="btn-icon" />
                Export
              </button>
              <button className="btn create-btn" onClick={handleCreateChallenge}>
                <img src={`${process.env.PUBLIC_URL}/add.png`} alt="Create Challenge" className="btn-icon" />
                New Challenge
              </button>
            </div>
          </div>

          <div className="challenges-divider"></div>

          <div className="challenges-toolbar">
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
                    <div className="filter-header" onClick={() => setFilters(prev => ({ ...prev, showParticipants: !prev.showParticipants }))}>
                      <span>Participants</span>
                      <img src={`${process.env.PUBLIC_URL}/dropdown.png`} alt="Dropdown" />
                    </div>
                    {filters.showParticipants && (
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
                    )}
                  </div>
                  <div className="filter-section">
                    <div className="filter-header" onClick={() => setFilters(prev => ({ ...prev, showReward: !prev.showReward }))}>
                      <span>Reward Range</span>
                      <img src={`${process.env.PUBLIC_URL}/dropdown.png`} alt="Dropdown" />
                    </div>
                    {filters.showReward && (
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

          <div className="challenges-divider"></div>

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

          {filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((challenge, index) => (
            <div
              key={challenge.id || index}
              className={`challenges-table-row ${selectedRows.includes(index) ? "selected" : ""}`}
              onClick={(e) => handleRowClick(index, e)}
            >
              <div className="table-cell radio-column">
                <div className={`custom-radio ${selectedRows.includes(index) ? "selected" : ""}`}></div>
              </div>
              <div className="table-cell">{challenge.name}</div>
              <div className="table-cell">{challenge.description}</div>
              <div className="table-cell">{formatDate(new Date(challenge.launch_date))}</div>
              <div className="table-cell reward-cell">
                <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Reward" className="reward-icon" />
                {challenge.reward}
              </div>
              <div className="table-cell">{challenge.remaining_time}</div>
              <div className="table-cell">{Array.isArray(challenge.participants) ? challenge.participants.join(", ") : challenge.participants}</div>
              <div className="table-cell action-cell" onClick={(e) => handleActionClick(index, e)}>
                <span>Action</span>
                <img src={`${process.env.PUBLIC_URL}/dropdown.png`} alt="Dropdown" className="dropdown-icon" />
                {showActionDropdown === index && (
                  <div className="action-dropdown">
                    <div className="dropdown-item" onClick={() => handleEditChallenge(challenge.id)}>
                      <img src={`${process.env.PUBLIC_URL}/edit.png`} alt="Edit" className="action-icon" />
                      <span>Edit</span>
                    </div>
                    <div className="dropdown-item" onClick={() => handleDeleteChallenge(challenge.id)}>
                      <img src={`${process.env.PUBLIC_URL}/deletered.png`} alt="Delete" className="action-icon" />
                      <span>Delete</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="challenges-divider"></div>

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

          {showCreateChallengeOverlay && (
            <CreateChallengeOverlay
              onClose={() => {
                setShowCreateChallengeOverlay(false);
                setSelectedChallenge(null);
              }}
              onSubmit={handleCreateChallengeSubmit}
              isEditing={isEditing}
              challengeToEdit={selectedChallenge}
            />
          )}

          {showDeleteOverlay && (
            <div className="overlay-backdrop">
              <div className="overlay-content">
                <center>
                  <img
                    src={`${process.env.PUBLIC_URL}/Red Delete.png`}
                    alt="Delete Icon"
                    className="overlay-icon"
                  />
                </center>
                <h2>Delete Challenge?</h2>
                <p>Are you sure you want to delete this challenge? This action cannot be undone.</p>
                <button className="overlay-submit-button" onClick={confirmDeleteChallenge}>
                  Confirm Delete
                </button>
                <button 
                  className="overlay-back-link" 
                  onClick={() => setShowDeleteOverlay(false)} 
                  style={{ background: 'none', border: 'none', color: 'white', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Challenges;
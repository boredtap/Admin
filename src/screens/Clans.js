import React, { useState, useEffect, useCallback } from 'react';
import NavigationPanel from '../components/NavigationPanel';
import AppBar from '../components/AppBar';
import * as XLSX from 'xlsx';
import "react-datepicker/dist/react-datepicker.css";
import './Clans.css';

const ClanProfileOverlay = ({ onClose, clanId, onApprove, onDisband, onResume, onStatusUpdate }) => {
  const [clan, setClan] = useState(null);
  const [topEarners, setTopEarners] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClanProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error("No access token found");

        // Fetch clan details
        const clanResponse = await fetch(`https://bt-coins.onrender.com/admin/clan/get_clan/${clanId}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        if (!clanResponse.ok) throw new Error("Failed to fetch clan profile");
        const clanData = await clanResponse.json();
        setClan(clanData);

        // Fetch top earners
        const topEarnersResponse = await fetch(
          `https://bt-coins.onrender.com/admin/clan/clan/${clanId}/top_earner?page_number=1&page_size=20`,
          {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
          }
        );
        if (!topEarnersResponse.ok) throw new Error("Failed to fetch top earners");
        const topEarnersData = await topEarnersResponse.json();
        setTopEarners(topEarnersData);

        // Placeholder for image route (commented out until available)
        /*
        const imageResponse = await fetch(`https://bt-coins.onrender.com/admin/clan/clan/${clanId}/image`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        if (!imageResponse.ok) throw new Error("Failed to fetch clan image");
        const imageData = await imageResponse.json();
        // Assuming imageData contains { image_url: "..." }
        setClan(prev => ({ ...prev, image_url: imageData.image_url }));
        */
      } catch (err) {
        setError(err.message);
      }
    };
    fetchClanProfile();
  }, [clanId]);

  if (error) return <div className="overlay-backdrop"><div className="clan-overlay">Error: {error}</div></div>;
  if (!clan) return <div className="overlay-backdrop"><div className="clan-overlay">Loading...</div></div>;

  // Update status when an action is taken from within the overlay
  const handleAction = (action) => {
    if (action === "approve") {
      onApprove(clanId);
      onStatusUpdate("Active");
    } else if (action === "disband") {
      onDisband(clanId);
      onStatusUpdate("Disband");
    } else if (action === "resume") {
      onResume(clanId);
      onStatusUpdate("Active");
    }
  };

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="clan-profile-overlay" onClick={(e) => e.stopPropagation()}>
        <div className="overlay-header">
          <h1>Clan Profile</h1>
          <span className="cancel-icon" onClick={onClose}>×</span>
        </div>

        <div className="profile-section">
          <div className="clan-image">
            <img src={clan.image_url || `${process.env.PUBLIC_URL}/logo.png`} alt="Clan" width="80" height="80" />
          </div>
          <div className="clan-info">
            <h2 className="clan-name">{clan.name}</h2>
            <p className="status">
              {/* Status:  */}
              <span className={`status-btn ${clan.status.toLowerCase()}`}>{clan.status}</span></p>
          </div>
        </div>

        {/* Rest of the overlay remains unchanged */}
        <div className="details-section">
          <h3>Clan Details</h3>
          <hr />
          <div className="details-row">
            <div className="detail-item">
              <span className="detail-title">Clan Rank</span>
              <span className="detail-value">{clan.rank}</span>
            </div>
            <div className="detail-item">
              <span className="detail-title">Clan Creator</span>
              <span className="detail-value">{clan.creator}</span>
            </div>
            <div className="detail-item">
              <span className="detail-title">Coin Earned</span>
              <span className="detail-value">{clan.coins_earned}</span>
            </div>
            <div className="detail-item">
              <span className="detail-title">Members</span>
              <span className="detail-value">{clan.members}</span>
            </div>
          </div>
        </div>

        <hr className="section-divider" />
        <div className="earners-section">
          <div className="earners-header">
            <h3>Clan Top Earners</h3>
            {/* <span className="see-all">See all</span> */}
          </div>
          <hr />
          {topEarners.length > 0 ? (
            topEarners.map((earner, index) => (
              <div key={index} className="earners-row">
                <div className="earner-item radio-column"><div className="custom-radio"></div></div>
                <div className="earner-item">
                  <span className="earner-title">User Name</span>
                  <span className="earner-value">{earner.username}</span>
                </div>
                <div className="earner-item">
                  <span className="earner-title">Level</span>
                  <span className="earner-value">{earner.level}</span>
                </div>
                <div className="earner-item">
                  <span className="earner-title">Total Coin</span>
                  <span className="earner-value">{earner.total_coins}</span>
                </div>
                <div className="earner-item">
                  <span className="earner-title">Ranking</span>
                  <span className="earner-value">{earner.rank}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="earners-row">
              <div className="earner-item radio-column"><div className="custom-radio"></div></div>
              <div className="earner-item">
                <span className="earner-title">User Name</span>
                <span className="earner-value">-</span>
              </div>
              <div className="earner-item">
                <span className="earner-title">Level</span>
                <span className="earner-value">-</span>
              </div>
              <div className="earner-item">
                <span className="earner-title">Total Coin</span>
                <span className="earner-value">-</span>
              </div>
              <div className="earner-item">
                <span className="earner-title">Ranking</span>
                <span className="earner-value">-</span>
              </div>
            </div>
          )}
        </div>

        <div className="action-buttons">
          {clan.status.toLowerCase() === 'active' ? (
            <button className="disband-btn" onClick={() => handleAction("disband")}>
              <img src={`${process.env.PUBLIC_URL}/deletered.png`} alt="Disband" className="btn-icon" />
              Disband
            </button>
          ) : clan.status.toLowerCase() === 'pending' ? (
            <>
              <button className="disband-btn" onClick={() => handleAction("disband")}>
                <img src={`${process.env.PUBLIC_URL}/deletered.png`} alt="Disband" className="btn-icon" />
                Disband
              </button>
              <button className="approve-btn" onClick={() => handleAction("approve")}>
                <img src={`${process.env.PUBLIC_URL}/edit.png`} alt="Approve" className="btn-icon" />
                Approve
              </button>
            </>
          ) : (
            <button className="resume-btn" onClick={() => handleAction("resume")}>
              <img src={`${process.env.PUBLIC_URL}/edit.png`} alt="Resume" className="btn-icon" />
              Resume
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Clans = () => {
  const [selectedClanId, setSelectedClanId] = useState(null);
  const [showApproveOverlay, setShowApproveOverlay] = useState(false);
  const [showDisbandOverlay, setShowDisbandOverlay] = useState(false);
  const [showResumeOverlay, setShowResumeOverlay] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeTab, setActiveTab] = useState("All Clans");
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [error, setError] = useState(null);
  const [showClanOverlay, setShowClanOverlay] = useState(null);
  const [filters, setFilters] = useState({
    status: { Active: false, Pending: false, Disband: false },
    level: {
      'Novice-Lv 1': false, 'Explorer-Lv 2': false, 'Apprentice-Lv 3': false,
      'Warrior-Lv 4': false, 'Master - Lv 5': false, 'Champion - Lv 6': false,
      'Tactician- Lv 7': false, 'Specialist - Lv 8': false, 'Conqueror -Lv 9': false,
      'Legend - Lv 10': false
    }
  });

  const [clansData, setClansData] = useState({
    "All Clans": [], "Active": [], "Pending Approval": [], "Disband": []
  });

  const fetchClans = useCallback(async (category, page = currentPage, pageSize = rowsPerPage) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      const categoryMap = {
        "All Clans": "all_clans",
        "Active": "active",
        "Pending Approval": "pending",
        "Disband": "disband"
      };
      const apiCategory = categoryMap[category] || "all_clans";

      const response = await fetch(
        `https://bt-coins.onrender.com/admin/clan/get_clans?category=${apiCategory}&page=${page}&page_size=${pageSize}`,
        {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        }
      );
      if (!response.ok) throw new Error("Failed to fetch clans");

      const data = await response.json();
      setClansData(prev => ({ ...prev, [category]: data }));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    fetchClans(activeTab);
  }, [activeTab, fetchClans]);

  const alterClanStatus = async (clanId, action) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      const response = await fetch(
        `https://bt-coins.onrender.com/admin/clan/alter_clan_status/${clanId}?alter_action=${action}`,
        {
          method: "POST",
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        }
      );
      if (!response.ok) throw new Error(`Failed to ${action} clan`);

      fetchClans(activeTab);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleApprove = (clanId) => {
    setSelectedClanId(clanId); // Ensure clan is selected
    setShowApproveOverlay(true);
  };
  
  const handleDisband = (clanId) => {
    setSelectedClanId(clanId); // Ensure clan is selected
    setShowDisbandOverlay(true);
  };
  
  const handleResume = (clanId) => {
    setSelectedClanId(clanId); // Ensure clan is selected
    setShowResumeOverlay(true);
  };

  const confirmApprove = async () => {
    await alterClanStatus(selectedClanId, "approve");
    setShowApproveOverlay(false);
    setSelectedClanId(null);
    setSelectedRows([]);
    if (showClanOverlay === selectedClanId) {
      // Pass the new status to the overlay
      setClansData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(clan => 
          clan.id === selectedClanId ? { ...clan, status: "Active" } : clan
        )
      }));
    }
  };
  
  const confirmDisband = async () => {
    await alterClanStatus(selectedClanId, "disband");
    setShowDisbandOverlay(false);
    setSelectedClanId(null);
    setSelectedRows([]);
    if (showClanOverlay === selectedClanId) {
      setClansData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(clan => 
          clan.id === selectedClanId ? { ...clan, status: "Disband" } : clan
        )
      }));
    }
  };
  
  const confirmResume = async () => {
    await alterClanStatus(selectedClanId, "resume");
    setShowResumeOverlay(false);
    setSelectedClanId(null);
    setSelectedRows([]);
    if (showClanOverlay === selectedClanId) {
      setClansData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(clan => 
          clan.id === selectedClanId ? { ...clan, status: "Active" } : clan
        )
      }));
    }
  };

  const formatDate = (date) => {
    if (!date) return 'DD-MM-YYYY';
    return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
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
          {weekDays.map(day => <div key={day} className="weekday">{day}</div>)}
        </div>
        <div className="days-grid">
          {days.map((date, index) => (
            <div
              key={index}
              className={`day ${date ? 'valid-day' : ''} ${selectedDate && date && date.toDateString() === selectedDate.toDateString() ? 'selected' : ''}`}
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
      [category]: { ...prev[category], [value]: !prev[category][value] }
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: { Active: false, Pending: false, Disband: false },
      level: {
        'Novice-Lv 1': false, 'Explorer-Lv 2': false, 'Apprentice-Lv 3': false,
        'Warrior-Lv 4': false, 'Master - Lv 5': false, 'Champion - Lv 6': false,
        'Tactician- Lv 7': false, 'Specialist - Lv 8': false, 'Conqueror -Lv 9': false,
        'Legend - Lv 10': false
      }
    });
  };

  const handleRowClick = (index, event) => {
    event.stopPropagation();
    if (event.target.className.includes('custom-radio')) {
      const clanId = clansData[activeTab][index].id;
      if (selectedClanId === clanId) {
        setSelectedClanId(null);
        setSelectedRows([]);
      } else {
        setSelectedClanId(clanId);
        setSelectedRows([index]);
      }
    } else {
      setShowClanOverlay(clansData[activeTab][index].id);
    }
  };

  const handleActionClick = (index, event) => {
    event.stopPropagation();
    setShowActionDropdown(showActionDropdown === index ? null : index);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedRows([]);
    setShowActionDropdown(null);
    setSelectedClanId(null);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handleDelete = () => {
    if (selectedClanId) {
      handleDisband(selectedClanId);
    }
  };

  const handleExport = () => {
    const dataToExport = filteredData.map(clan => ({
      'Clan Name': clan.name,
      'Owner or Creator': clan.creator,
      'Clan Rank': clan.rank,
      'Total Coin': clan.coins_earned,
      'Creation Date': formatDate(clan.created_at),
      'Status': clan.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clans');
    XLSX.writeFile(workbook, 'clans.xlsx');
  };

  const filteredData = clansData[activeTab].filter(clan => {
    const statusMatch = Object.keys(filters.status).some(status => filters.status[status] && clan.status.toLowerCase() === status.toLowerCase());
    const levelMatch = Object.keys(filters.level).some(level => filters.level[level] && clan.rank.toLowerCase().includes(level.toLowerCase().split('-')[0]));
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
        {error && <div className="error-message">Error: {error}</div>}
        <div className="clans-body-frame">
          <div className="clans-header">
            <div className="clans-pagination">
              {["All Clans", "Active", "Pending Approval", "Disband"].map(tab => (
                <span key={tab} className={`pagination-item ${activeTab === tab ? "active" : ""}`} onClick={() => handleTabChange(tab)}>
                  {tab}
                </span>
              ))}
            </div>
            <div className="clans-buttons">
              <button className="btn export-btn" onClick={handleExport}>
                <img src={`${process.env.PUBLIC_URL}/download.png`} alt="Export" className="btn-icon" />
                Export
              </button>
              <button className="btn create-btn">
                <img src={`${process.env.PUBLIC_URL}/add.png`} alt="Create Clan Challenge" className="btn-icon" />
                Clan Challenge
              </button>
            </div>
          </div>

          <div className="clans-divider"></div>

          <div className="clans-toolbar">
            <div className="search-bar">
              <img src={`${process.env.PUBLIC_URL}/search.png`} alt="Search" className="search-icon" />
              <input type="text" placeholder="Search by type, status...." className="search-input" />
              <img src={`${process.env.PUBLIC_URL}/filter.png`} alt="Filter" className="filter-icon" onClick={handleFilterClick} />
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
                            <input type="checkbox" checked={filters.status[status]} onChange={() => handleFilterChange('status', status)} />
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
                            <input type="checkbox" checked={filters.level[level]} onChange={() => handleFilterChange('level', level)} />
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
                {showDatePicker && <div className="date-picker-container"><CustomDatePicker /></div>}
              </div>
              <button className="btn delete-btn" onClick={handleDelete}>
                <img src={`${process.env.PUBLIC_URL}/delete.png`} alt="Delete" className="btn-icon" />
                Delete
              </button>
            </div>
          </div>

          <div className="clans-divider"></div>

          <div className="clans-table-header">
            <div className="table-heading radio-column"><div className="custom-radio"></div></div>
            <div className="table-heading">Clan Name</div>
            <div className="table-heading">Owner or Creator</div>
            <div className="table-heading">Clan Rank</div>
            <div className="table-heading">Total Coin</div>
            <div className="table-heading">Creation Date</div>
            <div className="table-heading">Status</div>
            <div className="table-heading action-heading"><span>Action</span></div>
          </div>

          <div className="clans-divider"></div>

          {filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((clan, index) => (
            <div key={clan.id} className={`clans-table-row ${selectedRows.includes(index) ? "selected" : ""}`} onClick={(e) => handleRowClick(index, e)}>
              <div className="table-cell radio-column">
                <div className={`custom-radio ${selectedRows.includes(index) ? "selected" : ""}`}></div>
              </div>
              <div className="table-cell">{clan.name}</div>
              <div className="table-cell">{clan.creator}</div>
              <div className="table-cell">{clan.rank}</div>
              <div className="table-cell reward-cell">
                <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Coin" className="reward-icon" />
                {clan.coins_earned}
              </div>
              <div className="table-cell">{formatDate(clan.created_at)}</div>
              <div className="table-cell">
                <span className={`status-btn ${clan.status.toLowerCase()}`}>{clan.status}</span>
              </div>
              <div className="table-cell action-cell" onClick={(e) => handleActionClick(index, e)}>
                <span>Action</span>
                <img src={`${process.env.PUBLIC_URL}/dropdown.png`} alt="Dropdown" className="dropdown-icon" />
                {showActionDropdown === index && (
                  <div className="action-dropdown">
                    {clan.status.toLowerCase() === 'disband' ? (
                      <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleResume(clan.id); }}>
                        <img src={`${process.env.PUBLIC_URL}/edit.png`} alt="Resume" className="action-icon" />
                        <span>Resume</span>
                      </div>
                    ) : clan.status.toLowerCase() === 'pending' ? (
                      <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleApprove(clan.id); }}>
                        <img src={`${process.env.PUBLIC_URL}/edit.png`} alt="Approve" className="action-icon" />
                        <span>Approve</span>
                      </div>
                    ) : (
                      <>
                        <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleApprove(clan.id); }}>
                          <img src={`${process.env.PUBLIC_URL}/edit.png`} alt="Approve" className="action-icon" />
                          <span>Approve</span>
                        </div>
                        <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleDisband(clan.id); }}>
                          <img src={`${process.env.PUBLIC_URL}/deletered.png`} alt="Disband" className="action-icon" />
                          <span>Disband</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="clans-divider"></div>

          <div className="table-footer">
            <div className="rows-per-page">
              <span>Show Result:</span>
              <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => <option key={num} value={num}>{num}</option>)}
              </select>
            </div>
            <div className="pagination-controls">
              <img src={`${process.env.PUBLIC_URL}/back-arrow.png`} alt="Previous" className="pagination-arrow" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} />
              <div className="page-numbers">
                {pageNumbers.map(num => (
                  <span key={num} className={`page-number ${currentPage === num ? 'active' : ''}`} onClick={() => setCurrentPage(num)}>
                    {num}
                  </span>
                ))}
              </div>
              <img src={`${process.env.PUBLIC_URL}/front-arrow.png`} alt="Next" className="pagination-arrow" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} />
            </div>
          </div>
        </div>
      </div>
      {showClanOverlay && (
        <ClanProfileOverlay 
          onClose={() => setShowClanOverlay(null)} 
          clanId={showClanOverlay} 
          onApprove={handleApprove} 
          onDisband={handleDisband} 
          onResume={handleResume} 
          onStatusUpdate={(newStatus) => {
            // Update clan status in overlay without refetching
            setClansData(prev => ({
              ...prev,
              [activeTab]: prev[activeTab].map(clan => 
                clan.id === showClanOverlay ? { ...clan, status: newStatus } : clan
              )
            }));
          }}
        />
      )}
      {showApproveOverlay && selectedClanId && (
        <div className="success-overlay">
          <div className="success-content">
            <img className="success-icon" src={`${process.env.PUBLIC_URL}/success.png`} alt="Approve" />
            <h2>Successful</h2>
            <p>This clan is successfully approved</p>
            <div className="success-buttons">
              <button className="success-proceed-button" onClick={confirmApprove}>
                Proceed
              </button>
              <button className="success-back-link" onClick={() => setShowApproveOverlay(false)}>
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {showDisbandOverlay && selectedClanId && (
        <div className="success-overlay">
          <div className="success-content">
            <img className="success-icon" src={`${process.env.PUBLIC_URL}/disband2.png`} alt="Disband" />
            <h2>Disband</h2>
            <p>Are you sure you want to disband this clan?</p>
            <div className="success-buttons">
              <button className="success-proceed-button" onClick={confirmDisband}>
                Disband
              </button>
              <button className="success-back-link" onClick={() => setShowDisbandOverlay(false)}>
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {showResumeOverlay && selectedClanId && (
        <div className="success-overlay">
          <div className="success-content">
            <img className="success-icon" src={`${process.env.PUBLIC_URL}/resume2.png`} alt="Resume" />
            <h2>Resume</h2>
            <p>Are you sure you want to resume this clan?</p>
            <div className="success-buttons">
              <button className="success-proceed-button" onClick={confirmResume}>
                Resume
              </button>
              <button className="success-back-link" onClick={() => setShowResumeOverlay(false)}>
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clans;

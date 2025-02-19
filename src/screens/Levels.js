import React, { useState, useEffect } from 'react';
import NavigationPanel from '../components/NavigationPanel';
import CreateLevelOverlay from '../components/CreateLevelOverlay';
import AppBar from '../components/AppBar';
import * as XLSX from 'xlsx';
import "react-datepicker/dist/react-datepicker.css";
import './Levels.css';

const Levels = () => {
  // State Declarations
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Levels");
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false); // For delete confirmation
  const [levelToDelete, setLevelToDelete] = useState(null);
  const [showCreateOverlay, setShowCreateOverlay] = useState(false);
  const decodeLevelName = (encodedName) => {
    try {
      return decodeURIComponent(encodedName);
    } catch (e) {
      console.warn('Failed to decode level name:', encodedName, e);
      return encodedName; // Fallback to original if decoding fails
    }
  };
  
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

  const [levelsData, setLevelsData] = useState({
    "Levels": []
  });

  // Fetch Levels
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        const response = await fetch("https://bt-coins.onrender.com/admin/levels/get_levels", {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) throw new Error("Failed to fetch levels");

        const data = await response.json();
        setLevelsData(prev => ({
          ...prev,
          "Levels": data
        }));
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLevels();
  }, []);

  // Utility Functions
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

  // Delete Functions
  const handleDelete = (levelId) => {
    setLevelToDelete(levelId);
    setShowDeleteOverlay(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!levelToDelete) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      const response = await fetch(
        `https://bt-coins.onrender.com/admin/levels/delete_level/${levelToDelete}`,
        {
          method: "DELETE",
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error("Failed to delete level");

      const result = await response.json();
      console.log(result.message);

      // Update local state
      setLevelsData(prev => ({
        ...prev,
        "Levels": prev["Levels"].filter(level => level.id !== levelToDelete)
      }));

      setSelectedRows([]);
      setShowDeleteOverlay(false);
      setLevelToDelete(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExport = () => {
    const dataToExport = filteredData.map(level => ({
      'Name': level.name || 'N/A',
      'Badge': level.badge || 'N/A',
      'Level': level.level || 'N/A',
      'Requirement': level.requirement || 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Levels');
    XLSX.writeFile(workbook, 'levels.xlsx');
  };

  const filteredData = levelsData[activeTab].filter(level => {
    const levelMatch = Object.keys(filters.level).some(lvl => 
      filters.level[lvl] && level.name?.toLowerCase().includes(lvl.toLowerCase()));
    return (!Object.values(filters.level).some(v => v) || levelMatch);
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="levels-page">
      <NavigationPanel />
      <div className="main-wrapper">
        <AppBar screenName="Levels" />
        {error && <div className="error-message">Error: {error}</div>}
        <div className="levels-body-frame">
          <div className="levels-header">
            <div className="levels-pagination">
              <span 
                className={`pagination-item ${activeTab === "Levels" ? "active" : ""}`}
                onClick={() => handleTabChange("Levels")}
              >
                Levels
              </span>
            </div>
            <div className="levels-buttons">
              <button className="btn export-btn" onClick={handleExport}>
                <img src={`${process.env.PUBLIC_URL}/download.png`} alt="Export" className="btn-icon" />
                Export
              </button>
              <button className="btn create-btn" onClick={() => setShowCreateOverlay(true)}>
              <img src={`${process.env.PUBLIC_URL}/add.png`} alt="Create Level" className="btn-icon" />
              Create Level
            </button>
            </div>
          </div>

          <div className="levels-divider"></div>

          <div className="levels-toolbar">
            <div className="search-bar">
              <img src={`${process.env.PUBLIC_URL}/search.png`} alt="Search" className="search-icon" />
              <input type="text" placeholder="Search levels..." className="search-input" />
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
                      <span>Level</span>
                      <img src={`${process.env.PUBLIC_URL}/dropdown.png`} alt="Dropdown" />
                    </div>
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
                  </div>
                  <button className="clear-filters" onClick={clearFilters}>
                    <span>Clear selection</span>
                  </button>
                </div>
              )}
            </div>
            <button className="btn delete-btn" onClick={() => handleDelete(selectedRows[0])} disabled={selectedRows.length !== 1}>
              <img src={`${process.env.PUBLIC_URL}/delete.png`} alt="Delete" className="btn-icon" />
              Delete
            </button>
          </div>

          <div className="levels-divider"></div>

          <div className="levels-table-header">
            <div className="table-heading radio-column">
              <div className="custom-radio"></div>
            </div>
            <div className="table-heading">Name</div>
            <div className="table-heading">Badge</div>
            <div className="table-heading">Level</div>
            <div className="table-heading">Requirement</div>
            <div className="table-heading action-heading">
              <span>Action</span>
            </div>
          </div>

          <div className="levels-divider"></div>

          {filteredData.length === 0 ? (
            <div className="no-data">No levels to display</div>
          ) : (
            filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((level, index) => (
              <div
                key={level.id || index}
                className={`levels-table-row ${selectedRows.includes(index) ? "selected" : ""}`}
                onClick={(e) => handleRowClick(index, e)}
              >
                <div className="table-cell radio-column">
                  <div className={`custom-radio ${selectedRows.includes(index) ? "selected" : ""}`}></div>
                </div>
                <div className="table-cell">{decodeLevelName(level.name) || 'N/A'}</div>
                <div className="table-cell">{level.badge || 'N/A'}</div>
                <div className="table-cell">{level.level || 'N/A'}</div>
                <div className="table-cell reward-cell">
                  <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Requirement" className="reward-icon" />
                  {level.requirement || 'N/A'}
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
                      <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleDelete(level.id); }}>
                        <img src={`${process.env.PUBLIC_URL}/deletered.png`} alt="Delete" className="action-icon" />
                        <span>Delete</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          <div className="levels-divider"></div>

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

      {/* Create Level Overlay */}
      {showCreateOverlay && (
          <CreateLevelOverlay 
            onClose={() => setShowCreateOverlay(false)} 
            onSubmit={(newLevel) => {
              setLevelsData(prev => ({
                ...prev,
                "Levels": [...prev["Levels"], newLevel] // Add new level to state
              }));
            }} 
          />
        )}

      {/* Delete Confirmation Overlay (Your Style) */}
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
            <h2>Delete?</h2>
            <p>Are you sure to delete this level?</p>
            <button className="overlay-submit-button" onClick={handleDeleteConfirmed}>
              Delete
            </button>
            <button 
              className="overlay-back-link" 
              onClick={() => setShowDeleteOverlay(false)} 
              style={{ background: 'none', border: 'none', color: 'white', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Levels;
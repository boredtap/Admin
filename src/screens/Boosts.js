import React, { useState, useEffect, useCallback } from 'react';
import NavigationPanel from '../components/NavigationPanel';
import CreateBoosterOverlay from '../components/CreateBoosterOverlay';
import AppBar from '../components/AppBar';
import * as XLSX from 'xlsx';
import "react-datepicker/dist/react-datepicker.css";
import './Boosts.css';

const Boosts = () => {
  const [showCreateBoosterOverlay, setShowCreateBoosterOverlay] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeTab, setActiveTab] = useState("Extra Boosters");
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
  const [boostsToDelete, setBoostsToDelete] = useState([]);
  const handleCreateBooster = () => {
    setShowCreateBoosterOverlay(true);
  };
  
  const handleBoosterSubmit = (newBooster) => {
    setBoostsData(prev => ({
      ...prev,
      "Extra Boosters": [...prev["Extra Boosters"], newBooster]
    }));
    // Remove setShowCreateBoosterOverlay(false) from here
    // Let CreateBoosterOverlay handle closing via Proceed
  };

  const [filters, setFilters] = useState({
    level: {
      '1': false,
      '2': false,
      '3': false,
      '4': false,
      '5': false,
      '6': false,
      '7': false,
      '8': false,
      '9': false,
      '10': false
    }
  });

  const [boostsData, setBoostsData] = useState({
    "Extra Boosters": [],
    "Streak": []
  });

  const API_BASE_URL = 'https://bt-coins.onrender.com';
  const getAuthToken = () => localStorage.getItem('access_token');

  const fetchExtraBoosters = useCallback(async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/boost/extra_boosters`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch boosts: ${response.status}`);
      }

      const data = await response.json();
      setBoostsData(prev => ({
        ...prev,
        "Extra Boosters": data
      }));
      setError(null);
    } catch (error) {
      console.error('Error fetching boosts data:', error);
      setError('Failed to load boosts data');
    }
  }, []);

  useEffect(() => {
    fetchExtraBoosters();
  }, [fetchExtraBoosters]);

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
        '1': false,
        '2': false,
        '3': false,
        '4': false,
        '5': false
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
    setShowActionDropdown(prev => prev === index ? null : index);
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

  const handleDeleteConfirmation = async () => {
    try {
      const token = getAuthToken();
      for (const boostId of boostsToDelete) {
        const response = await fetch(
          `${API_BASE_URL}/admin/boost/extra_booster?extra_boost_id=${boostId}`,
          {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to delete boost ${boostId}: ${response.status}`);
        }
      }

      await fetchExtraBoosters();
      setSelectedRows([]);
      setError(null);
      setShowDeleteOverlay(false);
      setBoostsToDelete([]);
    } catch (error) {
      console.error('Error deleting boosts:', error);
      setError('Failed to delete selected boosts');
      setShowDeleteOverlay(false);
    }
  };

  const handleDeleteClick = (index = null) => {
    if (index !== null) {
      // Single delete from Action dropdown
      const boost = filteredData[index];
      setBoostsToDelete([boost.id]);
    } else {
      // Multiple delete from toolbar
      const boosts = selectedRows.map(idx => filteredData[idx].id);
      setBoostsToDelete(boosts);
    }
    setShowDeleteOverlay(true);
  };

  const handleEditUpgradeCost = async (boostId, newCost) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/admin/boost/edit_upgrade_cost?extra_boost_id=${boostId}&upgrade_cost=${newCost}`,
        {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update boost ${boostId}: ${response.status}`);
      }

      await fetchExtraBoosters();
      setError(null);
    } catch (error) {
      console.error('Error updating boost cost:', error);
      setError('Failed to update boost upgrade cost');
    }
  };

  const handleExport = () => {
    const dataToExport = filteredData.map(boost => ({
      'Name': boost.name,
      'Description': boost.description,
      'Level': boost.level,
      'Effect': boost.effect,
      'Upgrade Cost': boost.upgrade_cost,
      'Condition': boost.condition,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Boosts');
    XLSX.writeFile(workbook, 'boosts.xlsx');
  };

  const filteredData = boostsData[activeTab].filter(boost => {
    const levelMatch = Object.keys(filters.level).some(level => 
      filters.level[level] && boost.level.toString() === level
    );
    return (!Object.values(filters.level).includes(true) || levelMatch);
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="boosts-page">
      <NavigationPanel />
      <div className="main-wrapper">
        <AppBar screenName="Boosts" />
        <div className="boosts-body-frame">
          {error && <div className="error-message">{error}</div>}
          
          <div className="boosts-header">
            <div className="boosts-pagination">
              <span 
                className={`pagination-item ${activeTab === "Extra Boosters" ? "active" : ""}`}
                onClick={() => handleTabChange("Extra Boosters")}
              >
                Extra Boosters
              </span>
              <span 
                className={`pagination-item ${activeTab === "Streak" ? "active" : ""}`}
                onClick={() => handleTabChange("Streak")}
              >
                Streak
              </span>
            </div>
            <div className="boosts-buttons">
              <button className="btn export-btn" onClick={handleExport}>
                <img src={`${process.env.PUBLIC_URL}/download.png`} alt="Export" className="btn-icon" />
                Export
              </button>
              <button className="btn create-btn" onClick={handleCreateBooster}>
                <img src={`${process.env.PUBLIC_URL}/add.png`} alt="Create Boost" className="btn-icon" />
                Booster
              </button>
            </div>
          </div>

          <div className="boosts-divider"></div>

          <div className="boosts-toolbar">
            <div className="search-bar">
              <img src={`${process.env.PUBLIC_URL}/search.png`} alt="Search" className="search-icon" />
              <input type="text" placeholder="Search boosts..." className="search-input" />
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
            <button className="btn delete-btn" onClick={() => handleDeleteClick()}>
              <img src={`${process.env.PUBLIC_URL}/delete.png`} alt="Delete" className="btn-icon" />
              Delete
            </button>
          </div>

          <div className="boosts-divider"></div>

          <div className="boosts-table-header">
            <div className="table-heading radio-column">
              <div className="custom-radio"></div>
            </div>
            <div className="table-heading">Name</div>
            <div className="table-heading">Description</div>
            <div className="table-heading">Level</div>
            <div className="table-heading">Effect</div>
            <div className="table-heading">Upgrade Cost</div>
            <div className="table-heading">Condition</div>
            <div className="table-heading action-heading">
              <span>Action</span>
            </div>
          </div>

          <div className="boosts-divider"></div>

          {filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((boost, index) => (
            <div
              key={boost.id} 
              className={`boosts-table-row ${selectedRows.includes(index) ? "selected" : ""}`}
              onClick={(e) => handleRowClick(index, e)}
            >
              <div className="table-cell radio-column">
                <div className={`custom-radio ${selectedRows.includes(index) ? "selected" : ""}`}></div>
              </div>
              <div className="table-cell">{boost.name}</div>
              <div className="table-cell">{boost.description}</div>
              <div className="table-cell">{boost.level}</div>
              <div className="table-cell">{boost.effect}</div>
              <div className="table-cell reward-cell">
                <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Reward" className="reward-icon" />
                {boost.upgrade_cost}
              </div>
              <div className="table-cell">{boost.condition}</div>
              <div className="table-cell action-cell" onClick={(e) => handleActionClick(index, e)}>
                <span>Action</span>
                <img src={`${process.env.PUBLIC_URL}/dropdown.png`} alt="Dropdown" className="dropdown-icon" />
                {showActionDropdown === index && (
                  <div className="action-dropdown">
                    <div 
                      className="dropdown-item" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        const newCost = prompt('Enter new upgrade cost:', boost.upgrade_cost);
                        if (newCost) handleEditUpgradeCost(boost.id, parseInt(newCost));
                      }}
                    >
                      <img src={`${process.env.PUBLIC_URL}/edit.png`} alt="Edit" className="action-icon" />
                      <span>Edit Cost</span>
                    </div>
                    <div 
                      className="dropdown-item" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleDeleteClick(index); 
                      }}
                    >
                      <img src={`${process.env.PUBLIC_URL}/deletered.png`} alt="Delete" className="action-icon" />
                      <span>Delete</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="boosts-divider"></div>

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

          {showDeleteOverlay && (
            <div className="overlay-backdrop">
              <div className="overlay-content">
                <center>
                  <img src={`${process.env.PUBLIC_URL}/Red Delete.png`} alt="Delete Icon" className="overlay-icon" />
                </center>
                <h2>Delete?</h2>
                <p>Are you sure you want to delete {boostsToDelete.length > 1 ? 'these boosts' : 'this boost'}?</p>
                <button className="overlay-submit-button" onClick={handleDeleteConfirmation}>
                  Delete
                </button>
                <button 
                  className="overlay-back-link" 
                  onClick={() => {
                    setShowDeleteOverlay(false);
                    setBoostsToDelete([]);
                  }} 
                  style={{ background: 'none', border: 'none', color: 'white', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Back
                </button>
              </div>
            </div>
          )}
           {showCreateBoosterOverlay && (
              <CreateBoosterOverlay
                onClose={() => setShowCreateBoosterOverlay(false)}
                onSubmit={handleBoosterSubmit}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default Boosts;
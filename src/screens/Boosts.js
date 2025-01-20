import React, { useState, useEffect } from 'react';
import NavigationPanel from '../components/NavigationPanel';
import AppBar from '../components/AppBar';
import * as XLSX from 'xlsx';
import "react-datepicker/dist/react-datepicker.css";
import './Boosts.css';

const Boosts = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeTab, setActiveTab] = useState("Extra Boosters");
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    level: {
      '1': false,
      '2': false,
      '3': false,
      '4': false,
      '5': false
    }
  });

  const [boostsData, setBoostsData] = useState({
    "Extra Boosters": [],
    "Streak": []
  });

  useEffect(() => {
    // Fetch data from backend
    fetch('/api/boosts-data')
      .then(response => response.json())
      .then(data => setBoostsData(data))
      .catch(error => console.error('Error fetching boosts data:', error));
  }, []);

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

  const handleDelete = () => {
    const updatedData = boostsData[activeTab].filter((_, index) => !selectedRows.includes(index));
    setBoostsData(prev => ({
      ...prev,
      [activeTab]: updatedData
    }));
    setSelectedRows([]);
  };

  const handleExport = () => {
    const dataToExport = filteredData.map(boost => ({
      'Name': boost.name,
      'Description': boost.description,
      'Level': boost.level,
      'Effect': boost.effect,
      'Upgrade Cost': boost.upgradeCost,
      'Condition': boost.condition,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Boosts');
    XLSX.writeFile(workbook, 'boosts.xlsx');
  };

  const filteredData = boostsData[activeTab].filter(boost => {
    const levelMatch = Object.keys(filters.level).some(level => filters.level[level] && boost.level.includes(level));
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
              <button className="btn create-btn">
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
            <button className="btn delete-btn" onClick={handleDelete}>
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
              key={index} 
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
                {boost.upgradeCost}
              </div>
              <div className="table-cell">{boost.condition}</div>
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

          {/* {showCreateBoostOverlay && (
            <CreateBoostOverlay 
              onClose={() => setShowCreateBoostOverlay(false)}
            />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Boosts;
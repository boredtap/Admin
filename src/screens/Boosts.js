import React, { useState } from 'react';
import NavigationPanel from '../components/NavigationPanel';
import AppBar from '../components/AppBar';
// import CreateBoostOverlay from '../components/CreateBoostOverlay';
import "react-datepicker/dist/react-datepicker.css";
import './Boosts.css';

const Boosts = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeTab, setActiveTab] = useState("Extra Boosters");
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
//   const [showCreateBoostOverlay, setShowCreateBoostOverlay] = useState(false);

  const [filters, setFilters] = useState({
    level: {
      '1': false,
      '2': false,
      '3': false,
      '4': false,
      '5': false
    }
  });

  const sampleData = {
    "Extra Boosters": Array(8).fill({ // Increased to 8 to simulate more pages
        name: "Boost",
        description: "Increase the amount of BT-Coin you can earn per one tap",
        level: "Level-1",
        effect: "+1 per tap",
        upgradeCost: "50,000",
        condition: "Upgrade Cost",
        action: "Action"
    }),
      
    "Streak": Array(8).fill({
        name: "Boost",
        description: "Increase the amount of BT-Coin you can earn per one tap",
        level: "Level-1",
        effect: "+1 per tap",
        upgradeCost: "50,000",
        condition: "Upgrade Cost",
        action: "Action"
    }),
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
      level: {
        '1': false,
        '2': false,
        '3': false,
        '4': false,
        '5': false
      }
    });
  };

  const handleRadioClick = (index, event) => {
    event.stopPropagation();
    setSelectedRow(index === selectedRow ? null : index);
  };

  const handleActionClick = (index, event) => {
    event.stopPropagation();
    setShowActionDropdown(prev => prev === index ? null : index);
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

  const totalPages = Math.ceil(sampleData[activeTab].length / rowsPerPage);
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
              <button className="btn export-btn">
                <img src={`${process.env.PUBLIC_URL}/download.png`} alt="Export" className="btn-icon" />
                Export
              </button>
              <button className="btn create-btn"
            //    onClick={() => setShowCreateBoostOverlay(true)}
               >
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
            <button className="btn delete-btn">
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

          {sampleData[activeTab].map((boost, index) => (
            <div
              key={index} 
              className={`boosts-table-row ${selectedRow === index ? "selected" : ""}`}
            >
              <div className="table-cell radio-column" onClick={(e) => handleRadioClick(index, e)}>
                <div className={`custom-radio ${selectedRow === index ? "selected" : ""}`}></div>
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
                    <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); /* Handle Delete */ }}>
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
              onClose={() => setShowCreateBoostOverlay(false)} */}
            {/* />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Boosts;
import React, { useState, useEffect } from 'react';
import NavigationPanel from '../components/NavigationPanel';
import AppBar from '../components/AppBar';
import CreateTaskOverlay from '../components/CreateTaskOverlay';
import * as XLSX from 'xlsx';
import "react-datepicker/dist/react-datepicker.css";
import './Tasks.css';

const Tasks = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeTab, setActiveTab] = useState("All Tasks");
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCreateTaskOverlay, setShowCreateTaskOverlay] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);

  const [filters, setFilters] = useState({
    status: {
      Active: false,
      Inactive: false,
      Paused: false
    },
    type: {
      'In-Game': false,
      'Special': false,
      'Social': false
    }
  });

  const [tasksData, setTasksData] = useState({
    "All Tasks": [],
    "In-Game": [],
    "Special": [],
    "Social": []
  });

  useEffect(() => {
    // Fetch data from backend
    fetch('/api/tasks-data')
      .then(response => response.json())
      .then(data => setTasksData(data))
      .catch(error => console.error('Error fetching tasks data:', error));
  }, []);

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
        Active: false,
        Inactive: false,
        Paused: false
      },
      type: {
        'In-Game': false,
        'Special': false,
        'Social': false
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
    const updatedData = tasksData[activeTab].filter((_, index) => !selectedRows.includes(index));
    setTasksData(prev => ({
      ...prev,
      [activeTab]: updatedData
    }));
    setSelectedRows([]);
  };

  const handleCreateTask = () => {
    setTaskToEdit(null);
    setShowCreateTaskOverlay(true);
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setShowCreateTaskOverlay(true);
  };

  const handleSubmitTask = (task) => {
    if (taskToEdit) {
      // Update existing task
      const updatedData = tasksData[activeTab].map(t => t.id === task.id ? task : t);
      setTasksData(prev => ({
        ...prev,
        [activeTab]: updatedData
      }));
    } else {
      // Create new task
      setTasksData(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], task]
      }));
    }
    setShowCreateTaskOverlay(false);
  };

  const handleExport = () => {
    const dataToExport = filteredData.map(task => ({
      'Task Name': task.name,
      'Task Type': task.type,
      'Description': task.description,
      'Status': task.status,
      'Reward': task.reward,
      'Participants': task.participants,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
    XLSX.writeFile(workbook, 'tasks.xlsx');
  };

  const filteredData = tasksData[activeTab].filter(task => {
    const statusMatch = Object.keys(filters.status).some(status => filters.status[status] && task.status === status);
    const typeMatch = Object.keys(filters.type).some(type => filters.type[type] && task.type === type);
    return (!Object.values(filters.status).includes(true) || statusMatch) &&
           (!Object.values(filters.type).includes(true) || typeMatch);
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="tasks-page">
      <NavigationPanel />
      <div className="main-wrapper">
        <AppBar screenName="Tasks" />
        <div className="tasks-body-frame">
          {/* Pagination Section */}
          <div className="tasks-header">
            <div className="tasks-pagination">
              <span className={`pagination-item ${activeTab === "All Tasks" ? "active" : ""}`} onClick={() => handleTabChange("All Tasks")}>All Tasks</span>
              <span className={`pagination-item ${activeTab === "In-Game" ? "active" : ""}`} onClick={() => handleTabChange("In-Game")}>In-Game</span>
              <span className={`pagination-item ${activeTab === "Special" ? "active" : ""}`} onClick={() => handleTabChange("Special")}>Special</span>
              <span className={`pagination-item ${activeTab === "Social" ? "active" : ""}`} onClick={() => handleTabChange("Social")}>Social</span>
            </div>
            <div className="tasks-buttons">
              <button className="btn export-btn" onClick={handleExport}>
                <img src={`${process.env.PUBLIC_URL}/download.png`} alt="Export" className="btn-icon" />
                Export
              </button>
              <button className="btn create-btn" onClick={handleCreateTask}>
                <img src={`${process.env.PUBLIC_URL}/create.png`} alt="Create Tasks" className="btn-icon" />
                Create Tasks
              </button>
            </div>
          </div>

          <div className="tasks-divider"></div>

          {/* Search Bar and Buttons */}
          <div className="tasks-toolbar">
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
                      <span>Task Status</span>
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
                    <div className="filter-header" onClick={() => setFilters(prev => ({ ...prev, showType: !prev.showType }))}>
                      <span>Task Type</span>
                      <img src={`${process.env.PUBLIC_URL}/dropdown.png`} alt="Dropdown" />
                    </div>
                    {filters.showType && (
                      <div className="filter-options">
                        {Object.keys(filters.type).map(type => (
                          <label key={type} className="filter-option">
                            <input
                              type="checkbox"
                              checked={filters.type[type]}
                              onChange={() => handleFilterChange('type', type)}
                            />
                            <span>{type}</span>
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
              <button className="btn delete-btn" onClick={() => setShowDeleteOverlay(true)}>
                <img src={`${process.env.PUBLIC_URL}/delete.png`} alt="Delete" className="btn-icon" />
                Delete
              </button>
            </div>
          </div>

          <div className="tasks-divider"></div>

          {/* Table Header */}
          <div className="tasks-table-header">
            <div className="table-heading radio-column">
              <div className="custom-radio"></div>
            </div>
            <div className="table-heading">Task Name</div>
            <div className="table-heading">Task Type</div>
            <div className="table-heading">Description</div>
            <div className="table-heading">Status</div>
            <div className="table-heading">Reward</div>
            <div className="table-heading">Participants</div>
            <div className="table-heading action-heading"> <span>Action</span></div>
          </div>

          <div className="tasks-divider"></div>

          {/* Table Rows */}
          {filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((task, index) => (
            <div
              key={index}
              className={`tasks-table-row ${selectedRows.includes(index) ? "selected" : ""}`}
              onClick={(e) => handleRowClick(index, e)}
            >
              <div className="table-cell radio-column">
                <div className={`custom-radio ${selectedRows.includes(index) ? "selected" : ""}`}></div>
              </div>
              <div className="table-cell">{task.name}</div>
              <div className="table-cell">{task.type}</div>
              <div className="table-cell">{task.description}</div>
              <div className="table-cell">
                <span className={`status-btn ${task.status.toLowerCase()}`}>
                  {task.status}
                </span>
              </div>
              <div className="table-cell reward-cell">
                <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Reward" className="reward-icon" />
                {task.reward}
              </div>
              <div className="table-cell">{task.participants}</div>
              <div className="table-cell action-cell" onClick={(e) => handleActionClick(index, e)}>
                <span>Action</span>
                <img src={`${process.env.PUBLIC_URL}/dropdown.png`} alt="Dropdown" className="dropdown-icon" />
                {showActionDropdown === index && (
                  <div className="action-dropdown">
                    <div className="dropdown-item" onClick={() => handleEditTask(task)}>
                      <img src={`${process.env.PUBLIC_URL}/edit.png`} alt="Edit" className="action-icon" />
                      <span>Edit</span>
                    </div>
                    <div className="dropdown-item" onClick={() => setShowDeleteOverlay(true)}>
                      <img src={`${process.env.PUBLIC_URL}/deletered.png`} alt="Delete" className="action-icon" />
                      <span>Delete</span>
                    </div>
                  </div> 
                )}
              </div>
            </div>
          ))}

          <div className="tasks-divider"></div>

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
          
          {showCreateTaskOverlay && (
            <CreateTaskOverlay 
              onClose={() => setShowCreateTaskOverlay(false)}
              taskToEdit={taskToEdit}
              onSubmit={handleSubmitTask}
            />
          )}

          {showDeleteOverlay && (
         <div className="overlay-backdrop">
          <div className="overlay-content">
            <center><img
              src={`${process.env.PUBLIC_URL}/Red Delete.png`}
              alt="Delete Icon"
              className="overlay-icon"
            /></center>
            <h2>Delete?</h2>
            <p>Are you sure to delete this task?</p>
            <button className="overlay-submit-button" onClick={handleDelete}>
              Delete
            </button>
            <a href="#" className="overlay-back-link" onClick={() => setShowDeleteOverlay(false)}>Back</a>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
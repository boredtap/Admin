import React, { useState, useEffect, useCallback } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    },
    showStatus: false,
    showType: false
  });

  const [tasksData, setTasksData] = useState({
    "All Tasks": [],
    "In-Game": [],
    "Special": [],
    "Social": []
  });

  // Combine fetchTasksData and fetchFilteredTasks into one function
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const params = new URLSearchParams();
    
    // Add filter conditions
    Object.entries(filters.status).forEach(([status, isChecked]) => {
      if (isChecked) params.append('status', status);
    });
    
    Object.entries(filters.type).forEach(([type, isChecked]) => {
      if (isChecked) params.append('type', type.toLowerCase());
    });
  
    if (searchTerm) params.append('search', searchTerm);
    
    try {
      const response = await fetch(
        `https://bored-tap-api.onrender.com/admin/task/all_tasks?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
  
      const data = await response.json();
      
      setTasksData({
        "All Tasks": data,
        "In-Game": data.filter(task => task.task_type === 'in-game'),
        "Special": data.filter(task => task.task_type === 'special'),
        "Social": data.filter(task => task.task_type === 'social')
      });
    } catch (error) {
      setError(error.message);
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm]); // Add dependencies here
  

  // Use effect to fetch data when filters or search term change
  useEffect(() => {
    fetchTasks();
  }, [filters, searchTerm, fetchTasks]);

  const handleEditTask = async (task) => {
    setShowActionDropdown(null);
    try {
      const response = await fetch(
        `https://bored-tap-api.onrender.com/admin/task/tasks_by_id?task_id=${task.id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch task details');
      }

      const fullTaskDetails = await response.json();
      setTaskToEdit(fullTaskDetails);
      setShowCreateTaskOverlay(true);
    } catch (error) {
      console.error('Error fetching task details:', error);
      // Show error to user
    }
  };

  const handleSubmitTask = async (taskData) => {
    try {
      const endpoint = taskData.id 
        ? 'https://bored-tap-api.onrender.com/admin/task/update_task' 
        : 'https://bored-tap-api.onrender.com/admin/task/create_task';
      
      const formData = new FormData();
      Object.entries(taskData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
  
      const response = await fetch(endpoint, {
        method: taskData.id ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Task submission failed');
      }
  
      // Refresh the task list after successful submission
      await fetchTasks();
      setShowCreateTaskOverlay(false);
    } catch (error) {
      console.error('Task submission error:', error);
      // Show error to user
    }
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
    if (date) {
      setSelectedDate(date);
    }
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

  const handleRowClick = (taskId, event) => {
    event.stopPropagation();
    setSelectedRows(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(row => row !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };

  const handleActionClick = (index, event, task) => {
    event.stopPropagation();
    setShowActionDropdown(prevIndex => {
      if (prevIndex === index) {
        // If clicking the same dropdown, close it
        return null;
      } else {
        // If clicking a different dropdown, close the previous one and open the new one
        return index;
      }
    });
  };

  const handleDeleteTask = async (task) => {
    setShowActionDropdown(null);
    setShowDeleteOverlay(true);
    setSelectedRows([task.id]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showActionDropdown !== null) {
        const actionCells = document.querySelectorAll('.table-cell.action-cell');
        let clickedInsideActionCell = false;
        actionCells.forEach(actionCell => {
          if (actionCell.contains(event.target)) {
            clickedInsideActionCell = true;
          }
        });
        if (!clickedInsideActionCell) {
          setShowActionDropdown(null);
        }
      }
    };
  
    document.addEventListener('click', handleClickOutside);
  
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showActionDropdown]);


  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedRows([]);
    setShowActionDropdown(null);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    try {
      const taskIdsToDelete = selectedRows;
      await Promise.all(taskIdsToDelete.map(taskId => 
        fetch(`https://bored-tap-api.onrender.com/admin/task/delete_task?task_id=${taskId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
      ));
      // Changed fetchTasksData to fetchTasks
      fetchTasks();
      setSelectedRows([]);
      setShowDeleteOverlay(false);
    } catch (error) {
      console.error('Error deleting tasks:', error);
    }
  };



  const handleCreateTask = () => {
    setTaskToEdit(null);
    setShowCreateTaskOverlay(true);
  };

  const handleExport = () => {
    const dataToExport = filteredData.map(task => ({
      'Task Name': task.task_name,
      'Task Type': task.task_type,
      'Description': task.task_description,
      'Status': task.task_status,
      'Reward': task.task_reward,
      'Participants': task.task_participants,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
    XLSX.writeFile(workbook, 'tasks.xlsx');
  };

  const filteredData = tasksData[activeTab].filter(task => {
    const statusMatch = !Object.values(filters.status).some(Boolean) || filters.status[task.task_status];
    const typeMatch = !Object.values(filters.type).some(Boolean) || filters.type[task.task_type];
    return statusMatch && typeMatch;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="tasks-page">
      <NavigationPanel />
      <div className="main-wrapper">
        <AppBar screenName="Tasks" />
        <div className="tasks-body-frame">
          {/* Show loading state */}
          {loading && <div className="loading">Loading tasks...</div>}
          
          {/* Show error state */}
          {error && <div className="error">Error: {error}</div>}
          
          {/* Only show content when not loading and no error */}
          {!loading && !error && (
            <>
              <div className="tasks-content">
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
                    <input 
                      type="text" 
                      placeholder="Search by type, status...." 
                      className="search-input"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
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
                  <div className="table-heading action-heading"><span>Action</span></div>
                </div>

                <div className="tasks-divider"></div>

                {/* Table Rows */}
                {filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((task, index) => (
                  <div
                    key={task.id}
                    className={`tasks-table-row ${selectedRows.includes(task.id) ? "selected" : ""}`}
                    onClick={(e) => handleRowClick(task.id, e)}
                  >
                    <div className="table-cell radio-column">
                      <div className={`custom-radio ${selectedRows.includes(task.id) ? "selected" : ""}`}></div>
                    </div>
                    <div className="table-cell">{task.task_name}</div>
                    <div className="table-cell">{task.task_type}</div>
                    <div className="table-cell">{task.task_description}</div>
                    <div className="table-cell">
                      <span className={`status-btn ${task.task_status ? task.task_status.toLowerCase() : ''}`}>
                        {task.task_status}
                      </span>
                    </div>
                    <div className="table-cell reward-cell">
                      <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Reward" className="reward-icon" />
                      {task.task_reward}
                    </div>
                    <div className="table-cell">{task.task_participants}</div>
                    <div className="table-cell action-cell" onClick={(e) => handleActionClick(index, e, task)}>
                      <span>Action</span>
                      <img src={`${process.env.PUBLIC_URL}/dropdown.png`} alt="Dropdown" className="dropdown-icon" />
                      {showActionDropdown === index && (
                        <div className="action-dropdown">
                          <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleEditTask(task); }}>
                            <img src={`${process.env.PUBLIC_URL}/edit.png`} alt="Edit" className="action-icon" />
                            <span>Edit</span>
                          </div>
                          <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleDeleteTask(task); }}>
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
              </div>

              {/* Overlays */}
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
                    <center>
                      <img
                        src={`${process.env.PUBLIC_URL}/Red Delete.png`}
                        alt="Delete Icon"
                        className="overlay-icon"
                      />
                    </center>
                    <h2>Delete?</h2>
                    <p>Are you sure to delete this task?</p>
                    <button className="overlay-submit-button" onClick={handleDelete}>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
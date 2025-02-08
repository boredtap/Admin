import React, { useState, useEffect } from 'react';
import './CreateTaskOverlay.css';

const CreateTaskOverlay = ({ onClose, taskToEdit, onSubmit }) => {
  const [formData, setFormData] = useState({
    taskName: '',
    taskType: '',
    description: '',
    participants: '',
    status: '',
    deadline: null,
    reward: '',
    image: null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setFormData(taskToEdit);
    }
  }, [taskToEdit]);

  const taskTypes = ['in-game', 'special', 'social'];
  const participantLevels = [
    'all_users', 'novice', 'explorer', 'apprentice',
    'warrior', 'master', 'champion',
    'tactician', 'specialist', 'conqueror',
    'legend',
  ];
  const statusOptions = ['active', 'inactive', 'pause'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called');
    console.log('formData before submission:', formData);
  
    try {
      let queryParams = new URLSearchParams();
      queryParams.append('task_name', formData.taskName);
      queryParams.append('task_type', formData.taskType.toLowerCase());
      queryParams.append('task_description', formData.description);
      queryParams.append('task_status', formData.status);
      queryParams.append('task_reward', formData.reward);
      
      // Format the date to ISO string if it's a Date object
      if (formData.deadline instanceof Date) {
        queryParams.append('task_deadline', formData.deadline.toISOString());
      } else {
        queryParams.append('task_deadline', formData.deadline); // Or handle it as a string if it's not a Date object
      }
  
      const formDataBody = new FormData();
      formDataBody.append('task_participants', formData.participants);
      if (formData.image) {
        formDataBody.append('task_image', formData.image);
      }
  
      const urlWithQuery = `https://bored-tap-api.onrender.com/admin/task/create_task?${queryParams.toString()}`;
      console.log('URL:', urlWithQuery);
  
      const response = await fetch(urlWithQuery, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: formDataBody,
      });
  
      if (!response.ok) {
        let errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
  
      const savedTask = await response.json();
      console.log('Success:', savedTask);
      setShowSuccessOverlay(true);
      onSubmit(savedTask);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };
  
  
  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      deadline: date,
    }));
    setShowDatePicker(false);
  };

  const formatDate = (date) => {
    if (!date) return 'DD-MM-YYYY';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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

  const changeMonth = (offset) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1)
    );
  };

  const CustomDatePicker = () => {
    const days = getDaysInMonth(currentMonth);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    return (
      <div className="custom-date-picker">
        <div className="date-picker-header">
          <button onClick={() => changeMonth(-1)}>{'<'}</button>
          <span>{months[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
          <button onClick={() => changeMonth(1)}>{'>'}</button>
        </div>
        <div className="weekdays">
          {weekDays.map((day) => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        <div className="days-grid">
          {days.map((date, index) => (
            <div
              key={index}
              className={`day ${date ? 'valid-day' : ''} ${
                formData.deadline &&
                date &&
                date.toDateString() === formData.deadline.toDateString()
                  ? 'selected'
                  : ''
              }`}
              onClick={() => date && handleDateChange(date)}
            >
              {date ? date.getDate() : ''}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Remove handleSuccessProceed since we're now handling success in handleSubmit

  return (
    <div className="overlay-backdrop">
      <div className="create-task-overlay">
        <div className="overlay-header">
          <h2>{taskToEdit ? 'Update Task' : 'Create Task'}</h2>
          <button className="close-button" onClick={onClose}>
            <img src={`${process.env.PUBLIC_URL}/cancel.png`} alt="Cancel" />
          </button>
        </div>
  
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Task Name</label>
            <input
              type="text"
              name="taskName"
              placeholder="Enter task name"
              value={formData.taskName}
              onChange={handleInputChange}
            />
          </div>
  
          <div className="form-row">
            <div className="form-field">
              <label>Task Type</label>
              <select
                name="taskType"
                value={formData.taskType}
                onChange={handleInputChange}
              >
                <option value="">Select task type</option>
                {taskTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
  
            <div className="form-field">
              <label>Task Description</label>
              <input
                type="text"
                name="description"
                placeholder="Enter task description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
  
          <div className="form-row">
            <div className="form-field">
              <label>Task Participants</label>
              <select
                name="participants"
                value={formData.participants}
                onChange={handleInputChange}
              >
                <option value="">Select participant level</option>
                {participantLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
  
            <div className="form-field">
              <label>Task Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="">Select status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
  
          <div className="form-row">
            <div className="form-field">
              <label>Task Deadline</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  placeholder="DD-MM-YYYY"
                  value={formatDate(formData.deadline)}
                  readOnly
                />
                <img
                  src={`${process.env.PUBLIC_URL}/date.png`}
                  alt="Date"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                />
                {showDatePicker && (
                  <div className="date-picker-container">
                    <CustomDatePicker />
                  </div>
                )}
              </div>
            </div>
  
            <div className="form-field">
              <label>Task Reward</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  name="reward"
                  placeholder="Enter task reward"
                  value={formData.reward}
                  onChange={handleInputChange}
                />
                <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Coin" />
              </div>
            </div>
          </div>
  
          <div className="form-field upload-field">
            <label>Upload Task Image</label>
            <div className="upload-area">
              <img src={`${process.env.PUBLIC_URL}/upload.png`} alt="Upload" />
              <p>
                Drop your image here or{' '}
                <label className="browse-label">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <span>Browse</span>
                </label>
              </p>
              <p className="support-text">Support: jpg, jpeg, png</p>
              {formData.image && (
                <div className="image-preview">
                  <img src={URL.createObjectURL(formData.image)} alt="Preview" />
                </div>
              )}
            </div>
          </div>
  
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
  
        {showSuccessOverlay && (
          <div className="success-overlay">
            <div className="success-content">
              <center><img src={`${process.env.PUBLIC_URL}/success.png`} alt="Success" className="success-icon" /></center>
              <h2>Successful</h2>
              <p>Your task is successfully created.</p>
              <button className="success-proceed-button" onClick={onClose}>Proceed</button>
              <button className="create-new-task-link" onClick={() => setShowSuccessOverlay(false)} style={{ background: 'none', border: 'none', color: 'white', textDecoration: 'underline', cursor: 'pointer' }}>Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTaskOverlay;
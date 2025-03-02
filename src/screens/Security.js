import React, { useState } from 'react';
import NavigationPanel from '../components/NavigationPanel';
import AppBar from '../components/AppBar';
import './Security.css';

const Security = () => {
  const [formData, setFormData] = useState({
    userId: '',
    userStatus: '',
    launchDate: null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showOverlay, setShowOverlay] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      launchDate: date,
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
          <button onClick={() => changeMonth(-1)}>&lt;</button>
          <span>{months[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
          <button onClick={() => changeMonth(1)}>&gt;</button>
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
                formData.launchDate &&
                date &&
                date.toDateString() === formData.launchDate.toDateString()
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowOverlay(true);
  };

  const handleOverlaySubmit = () => {
    const endpoint = formData.userStatus === 'Ban' ? '/api/ban-user' : `/admin/security/suspend_user/${formData.userId}`;
    const payload = {
      userId: formData.userId,
      status: formData.userStatus,
      launchDate: formData.launchDate,
    };
  
    const url = formData.userStatus === 'Ban' 
      ? endpoint 
      : `${endpoint}?status=suspend&end_date=${payload.launchDate.toISOString().split('T')[0]}&reason=bad%20guy`;
  
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        setShowOverlay(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleOverlayClose = () => {
    setShowOverlay(false);
  };

  return (
    <div className="security-page">
      <NavigationPanel />
      <div className="main-wrapper">
        <AppBar screenName="Security" />
        <div className="security-body-frame">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <label>User ID</label>
                <input
                  type="text"
                  name="userId"
                  placeholder="Enter user ID"
                  value={formData.userId}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-field">
                <label>Change User Status</label>
                <div className="input-with-icon">
                  <select
                    name="userStatus"
                    value={formData.userStatus}
                    onChange={handleInputChange}
                  >
                    <option value="">Select user status</option>
                    <option value="Ban">Ban</option>
                    <option value="Suspend">Suspend</option>
                  </select>
                </div>
              </div>
            </div>

            {formData.userStatus === 'Suspend' && (
              <div className="form-field">
                <label>Launch Date</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    placeholder="DD-MM-YYYY"
                    value={formatDate(formData.launchDate)}
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
            )}

            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      </div>
      {showOverlay && (
        <div className="overlay-backdrop">
          <div className="overlay-content">
            <center><img
              src={`${process.env.PUBLIC_URL}/overlay icon.png`}
              alt="overlay Icon"
              className="overlay-icon"
            /></center>
            <h2>{formData.userStatus === 'Ban' ? 'Ban User?' : 'Suspend User?'}</h2>
            <p>
              {formData.userStatus === 'Ban'
                ? 'Are you sure you want to ban this user?'
                : 'Are you sure you want to suspend this user?'}
            </p>
            <button className="overlay-submit-button" onClick={handleOverlaySubmit}>
              {formData.userStatus === 'Ban' ? 'Ban' : 'Suspend'}
            </button>
            <button className="overlay-back-link" onClick={() => handleOverlayClose(false)} style={{ background: 'none', border: 'none', color: 'white', textDecoration: 'underline', cursor: 'pointer' }}>Back</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Security;
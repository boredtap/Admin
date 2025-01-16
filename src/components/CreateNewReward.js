import React, { useState } from 'react';

const clans = ["TON Station", "HiddenCode", "h2o", "Tapper Legends"];
const levels = [
  'All Users', 'Novice-Lv 1', 'Explorer-Lv 2', 'Apprentice-Lv 3',
  'Warrior-Lv 4', 'Master - Lv 5', 'Champion - Lv 6',
  'Tactician- Lv 7', 'Specialist - Lv 8', 'Conqueror -Lv 9',
  'Legend - Lv 10'
];

const CreateRewardOverlay = ({ onClose }) => {
  const [formData, setFormData] = useState({
    rewardTitle: '',
    rewardAmount: '',
    launchDate: null,
    beneficiaryType: '',
    selectedClans: [],
    selectedLevels: [],
    specificUsers: '',
    image: null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const beneficiaryTypes = ['All Users', 'Clan(s)', 'Level(s)', 'Specific User(s)'];
  const [beneficiaryFieldLabel, setBeneficiaryFieldLabel] = useState('');
  const [showDropdown, setShowDropdown] = useState({ clans: false, levels: false });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBeneficiarySelection = (type) => {
    setFormData(prev => ({
      ...prev,
      beneficiaryType: type,
      selectedClans: [],
      selectedLevels: [],
      specificUsers: ''
    }));
    // Set the label based on the beneficiary type
    switch (type) {
      case 'Clan(s)':
        setBeneficiaryFieldLabel('Clan(s)');
        break;
      case 'Level(s)':
        setBeneficiaryFieldLabel('Level(s)');
        break;
      case 'Specific User(s)':
        setBeneficiaryFieldLabel('Specific User(s)');
        break;
      default:
        setBeneficiaryFieldLabel('');
    }
  };

  const toggleDropdown = (field) => {
    setShowDropdown(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleCheckboxChange = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item) 
        ? prev[field].filter(i => i !== item) 
        : [...prev[field], item]
    }));
  };

  const renderBeneficiaryField = () => {
    if (!beneficiaryFieldLabel) return null;

    let content;
    switch (beneficiaryFieldLabel) {
      case 'Clan(s)':
        content = (
          <div className="multi-select-field">
            <select 
              className="form-select" 
              value="" 
              onChange={() => toggleDropdown('clans')}
            >
              <option value="">Select Clans</option>
            </select>
            {showDropdown.clans && (
              <div className="checkbox-group">
                {clans.map((clan, index) => (
                  <label className="checkbox-label" key={index}>
                    <input 
                      type="checkbox" 
                      checked={formData.selectedClans.includes(clan)} 
                      onChange={() => handleCheckboxChange('selectedClans', clan)}
                    />
                    {clan}
                  </label>
                ))}
              </div>
            )}
          </div>
        );
        break;
      case 'Level(s)':
        content = (
          <div className="multi-select-field">
            <select 
              className="form-select" 
              value="" 
              onChange={() => toggleDropdown('levels')}
            >
              <option value="">Select Levels</option>
            </select>
            {showDropdown.levels && (
              <div className="checkbox-group">
                {levels.map((level, index) => (
                  <label className="checkbox-label" key={index}>
                    <input 
                      type="checkbox" 
                      checked={formData.selectedLevels.includes(level)} 
                      onChange={() => handleCheckboxChange('selectedLevels', level)}
                    />
                    {level}
                  </label>
                ))}
              </div>
            )}
          </div>
        );
        break;
      case 'Specific User(s)':
        content = (
          <input
            type="text"
            name="specificUsers"
            placeholder="Enter users name"
            value={formData.specificUsers}
            onChange={handleInputChange}
            className="form-input"
          />
        );
        break;
      default:
        content = null;
    } 

    return (
      <div className="form-field">
        <label>{beneficiaryFieldLabel}</label>
        {content}
      </div>
    );
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      launchDate: date
    }));
    setShowDatePicker(false);
  };

  // Date picker helper functions
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
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

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
                formData.launchDate && date &&
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

  return (
    <div className="overlay-backdrop">
      <div className="create-task-overlay">
        <div className="overlay-header">
          <h2>Create New Reward</h2>
          <button className="close-button" onClick={onClose}>
            <img src={`${process.env.PUBLIC_URL}/cancel.png`} alt="Cancel" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); console.log(formData); }}>
          <div className="form-field">
            <label>Reward Title</label>
            <input
              type="text"
              name="rewardTitle"
              placeholder="Enter reward title"
              value={formData.rewardTitle}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Reward</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  name="rewardAmount"
                  placeholder="Enter task reward"
                  value={formData.rewardAmount}
                  onChange={handleInputChange}
                />
                <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Coin" />
              </div>
            </div>

            <div className="form-field">
              <label>Launch Date</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  placeholder="DD-MM-YYYY"
                  value={formData.launchDate ? formData.launchDate.toISOString().split('T')[0] : ''}
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
          </div>

          {/* Update the form row for beneficiary selection */}
          <div className="form-row">
            <div className="form-field">
              <label>Beneficiary</label>
              <select
                name="beneficiaryType"
                value={formData.beneficiaryType}
                onChange={(e) => handleBeneficiarySelection(e.target.value)}
                className="form-select"
              >
                <option value="">Select beneficiary type</option>
                {beneficiaryTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            {renderBeneficiaryField()}
          </div>

          <div className="form-field upload-field">
            <label>Upload Reward Image</label>
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
            </div>
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRewardOverlay;
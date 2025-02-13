import React, { useState, useEffect } from 'react';
import './CreateNewReward.css';

const clans = ["TON Station", "HiddenCode", "h2o", "Tapper Legends"];
const levels = [
  'all_users', 'novice', 'explorer', 'apprentice',
  'warrior', 'master', 'champion',
  'tactician', 'specialist', 'conqueror',
  'legend'
];

const CreateRewardOverlay = ({ onClose, rewardToEdit, onSubmit, isEditing }) => {
  const [formData, setFormData] = useState({
    rewardTitle: '',
    rewardAmount: '',
    launchDate: new Date(),
    beneficiaryType: '',
    selectedClans: [],
    selectedLevels: [],
    specificUsers: '',
    image: null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState({ 
    beneficiaries: false,
    clans: false, 
    levels: false 
  });
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (rewardToEdit) {
      setFormData({
        rewardTitle: rewardToEdit.title,
        rewardAmount: rewardToEdit.reward,
        launchDate: new Date(rewardToEdit.launchDate),
        beneficiaryType: getBeneficiaryTypeReverse(rewardToEdit.beneficiary),
        selectedClans: rewardToEdit.beneficiary === 'clan' ? [rewardToEdit.beneficiaryDetail] : [],
        selectedLevels: rewardToEdit.beneficiary === 'level' ? [rewardToEdit.beneficiaryDetail] : [],
        specificUsers: rewardToEdit.beneficiary === 'specific_users' ? rewardToEdit.beneficiaryDetail.join(', ') : '',
        image: null,
      });
    }
  }, [rewardToEdit]);

  const getBeneficiaryTypeReverse = (beneficiary) => {
    switch (beneficiary) {
      case 'all_users': return 'All Users';
      case 'clan': return 'Clan(s)';
      case 'level': return 'Level(s)';
      case 'specific_users': return 'Specific User(s)';
      default: return '';
    }
  };

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
    setShowDropdown(prev => ({ ...prev, beneficiaries: false }));
  };

  const toggleDropdown = (field) => {
    setShowDropdown(prev => {
      const newState = { beneficiaries: false, clans: false, levels: false };
      newState[field] = !prev[field];
      return newState;
    });
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
    if (!formData.beneficiaryType || formData.beneficiaryType === 'All Users') return null;

    let content;
    switch (formData.beneficiaryType) {
      case 'Clan(s)':
        content = (
          <div className="dropdown-container">
            <div 
              className="dropdown-toggle"
              onClick={() => toggleDropdown('clans')}
            >
              {formData.selectedClans.length > 0 ? formData.selectedClans.join(', ') : "Select Clans"}
              <span className="dropdown-icon">▼</span>
            </div>
            {showDropdown.clans && (
              <div className="dropdown-menu">
                {clans.map((clan, index) => (
                  <label className="dropdown-item checkbox-label" key={index}>
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
          <div className="dropdown-container">
            <div 
              className="dropdown-toggle"
              onClick={() => toggleDropdown('levels')}
            >
              {formData.selectedLevels.length > 0 ? formData.selectedLevels.join(', ') : "Select Levels"}
              <span className="dropdown-icon">▼</span>
            </div>
            {showDropdown.levels && (
              <div className="dropdown-menu">
                {levels.map((level, index) => (
                  <label className="dropdown-item checkbox-label" key={index}>
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

    return content && (
      <div className="form-field">
        <label>{formData.beneficiaryType}</label>
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
          <button onClick={() => changeMonth(-1)}>{"<"}</button>
          <span>{months[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
          <button onClick={() => changeMonth(1)}>{">"}</button>
        </div>
        <div className="weekdays">
          {weekDays.map(weekDay => (
            <div key={weekDay} className="weekday">{weekDay}</div>
          ))}
        </div>
        <div className="days-grid">
          {days.map((date, index) => (
            <div
              key={index}
              className={`day ${date ? 'valid-day' : ''} ${formData.launchDate && date && date.toDateString() === formData.launchDate.toDateString() ? 'selected' : ''}`}
              onClick={() => date && handleDateChange(date)}
            >
              {date ? date.getDate() : ''}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const validateFormData = () => {
    if (!formData.rewardTitle.trim()) {
      alert('Please enter a reward title.');
      return false;
    }
    if (!formData.rewardAmount || isNaN(formData.rewardAmount)) {
      alert('Please enter a valid reward amount.');
      return false;
    }
    if (!formData.launchDate) {
      alert('Please select a launch date.');
      return false;
    }
    if (!formData.beneficiaryType) {
      alert('Please select a beneficiary type.');
      return false;
    }
    if (formData.beneficiaryType === 'Clan(s)' && formData.selectedClans.length === 0) {
      alert('Please select at least one clan.');
      return false;
    }
    if (formData.beneficiaryType === 'Level(s)' && formData.selectedLevels.length === 0) {
      alert('Please select at least one level.');
      return false;
    }
    if (formData.beneficiaryType === 'Specific User(s)' && !formData.specificUsers.trim()) {
      alert('Please enter at least one user.');
      return false;
    }
    if (!formData.image) {
      alert('Please upload an image for the reward.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateFormData()) return;

    try {
      const formDataBody = new FormData();
      
      // Add required query parameters
      const queryParams = new URLSearchParams({
        reward_title: formData.rewardTitle,
        reward: formData.rewardAmount,
        launch_date: formData.launchDate.toISOString().split('T')[0],
        beneficiary: getBeneficiaryType(formData.beneficiaryType)
      });
  
      // Add optional form data based on beneficiary type
      if (formData.beneficiaryType === 'Clan(s)') {
        formData.selectedClans.forEach(clan => formDataBody.append('clan', clan));
      } else if (formData.beneficiaryType === 'Level(s)') {
        formData.selectedLevels.forEach(level => formDataBody.append('level', level));
      } else if (formData.beneficiaryType === 'Specific User(s)') {
        formDataBody.append('specific_users', formData.specificUsers.split(',').map(user => user.trim()));
      }
      if (formData.image) {
        formDataBody.append('reward_image', formData.image);
      }
  
      console.log('Sending Data:', formData);

      const endpoint = isEditing ? 'update_reward' : 'create_reward';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(
        `https://bt-coins.onrender.com/admin/reward/${endpoint}?${queryParams.toString()}&reward_id=${rewardToEdit ? rewardToEdit.id : ''}`,
        {
          method: method,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: formDataBody,
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
      }
  
      const result = await response.json();
      console.log('Success:', result);
      setShowSuccessOverlay(true);
      onSubmit(result); // Call the onSubmit function passed as prop to update parent state
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to ' + (isEditing ? 'update' : 'create') + ' reward: ' + error.message);
    }
  };

  const getBeneficiaryType = (type) => {
    switch (type) {
      case 'All Users': return 'all_users';
      case 'Clan(s)': return 'clan';
      case 'Level(s)': return 'level';
      case 'Specific User(s)': return 'specific_users';
      default: return '';
    }
  };

  const handleCloseSuccessOverlay = () => {
    setShowSuccessOverlay(false);
    onClose();
  };

  const beneficiaryTypes = ['All Users', 'Clan(s)', 'Level(s)', 'Specific User(s)'];

  return (
    <div className="overlay-backdrop">
      <div className="create-task-overlay">
        <div className="overlay-header">
          <h2>{isEditing ? 'Update Reward' : 'Create New Reward'}</h2>
          <button className="close-button" onClick={onClose}>
            <img src={`${process.env.PUBLIC_URL}/cancel.png`} alt="Cancel" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
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
                  type="number"
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
      </div>
      {showSuccessOverlay && (
        <div className="success-overlay">
          <div className="success-content">
            <img className="success-icon" src={`${process.env.PUBLIC_URL}/success.png`} alt="Success" />
            <h2>Success!</h2>
            <p>Reward {isEditing ? 'updated' : 'created'} successfully.</p>
            <button className="success-proceed-button" onClick={handleCloseSuccessOverlay}>
              Proceed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRewardOverlay;
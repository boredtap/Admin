import React, { useState, useEffect } from 'react';

const clans = ["TON Station", "HiddenCode", "h2o", "Tapper Legends"];
const levels = [
  'all_users', 'novice', 'explorer', 'apprentice',
  'warrior', 'master', 'champion',
  'tactician', 'specialist', 'conqueror',
  'legend'
];

const CreateChallengeOverlay = ({ onClose, challengeToEdit, onSubmit, isEditing }) => {
  const [formData, setFormData] = useState({
    challengeName: '',
    challengeReward: '',
    challengeDescription: '',
    launchDate: new Date(),
    challengeDuration: '00:00:00',
    participantType: '',
    selectedClans: [],
    selectedLevels: [],
    specificUsers: '',
    image: null,
    imagePreview: ''
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
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
    if (challengeToEdit) {
      setFormData({
        challengeName: challengeToEdit.name || '',
        challengeReward: challengeToEdit.reward || '',
        challengeDescription: challengeToEdit.description || '',
        launchDate: challengeToEdit.launch_date ? new Date(challengeToEdit.launch_date) : new Date(),
        challengeDuration: challengeToEdit.duration || '00:00:00',
        participantType: getParticipantTypeReverse(challengeToEdit.participants),
        selectedClans: challengeToEdit.participants === 'clan' ? challengeToEdit.participantsDetail : [],
        selectedLevels: challengeToEdit.participants === 'level' ? challengeToEdit.participantsDetail : [],
        specificUsers: challengeToEdit.participants === 'specific_users' ? challengeToEdit.participantsDetail.join(', ') : '',
        image: null,
        imagePreview: challengeToEdit.image_url || ''
      });
    }
  }, [challengeToEdit]);

  const getParticipantTypeReverse = (participants) => {
    switch (participants) {
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

  const handleParticipantSelection = (type) => {
    setFormData(prev => ({
      ...prev,
      participantType: type,
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

  const renderParticipantField = () => {
    if (!formData.participantType || formData.participantType === 'All Users') return null;

    let content;
    switch (formData.participantType) {
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
        <label>{formData.participantType}</label>
        {content}
      </div>
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
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

  const handleTimeChange = (event) => {
    setFormData(prev => ({
      ...prev,
      challengeDuration: event.target.value
    }));
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

  const CustomTimePicker = () => {
    return (
      <div className="custom-time-picker">
        <input 
          type="time" 
          step="1" 
          value={formData.challengeDuration}
          onChange={handleTimeChange}
        />
      </div>
    );
  };

  const validateFormData = () => {
    if (!formData.challengeName.trim()) {
      alert('Please enter a challenge name.');
      return false;
    }
    if (!formData.challengeReward || isNaN(Number(formData.challengeReward))) {
      alert('Please enter a valid challenge reward.');
      return false;
    }
    if (!formData.launchDate) {
      alert('Please select a launch date.');
      return false;
    }
    if (!formData.challengeDuration || formData.challengeDuration.split(':').some(part => part === '')) {
      alert('Please set a valid challenge duration.');
      return false;
    }
    if (!formData.participantType) {
      alert('Please select a participant type.');
      return false;
    }
    if (formData.participantType === 'Clan(s)' && formData.selectedClans.length === 0) {
      alert('Please select at least one clan.');
      return false;
    }
    if (formData.participantType === 'Level(s)' && formData.selectedLevels.length === 0) {
      alert('Please select at least one level.');
      return false;
    }
    if (formData.participantType === 'Specific User(s)' && !formData.specificUsers.trim()) {
      alert('Please enter at least one user.');
      return false;
    }
    if (!formData.image && !formData.imagePreview) {
      alert('Please upload an image for the challenge.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateFormData()) return;

    try {
      const formDataBody = new FormData();
      
      const queryParams = new URLSearchParams({
        name: formData.challengeName,
        reward: formData.challengeReward,
        description: formData.challengeDescription,
        launch_date: formData.launchDate.toISOString().split('T')[0],
        duration: formData.challengeDuration,
        participants: getParticipantType(formData.participantType)
      });

      if (formData.participantType === 'Clan(s)') {
        formData.selectedClans.forEach(clan => formDataBody.append('clan', clan));
      } else if (formData.participantType === 'Level(s)') {
        formData.selectedLevels.forEach(level => formDataBody.append('level', level));
      } else if (formData.participantType === 'Specific User(s)') {
        formDataBody.append('specific_users', formData.specificUsers.split(',').map(user => user.trim()));
      }
      if (formData.image) {
        formDataBody.append('image', formData.image);
      } else {
        formDataBody.append('image_url', formData.imagePreview); 
      }

      const endpoint = isEditing ? 'update_challenge' : 'create_challenge';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(
        `https://bt-coins.onrender.com/admin/challenge/${endpoint}?${queryParams.toString()}&challenge_id=${challengeToEdit ? challengeToEdit.id : ''}`,
        {
          method: method,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: formDataBody,
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const result = await response.json();
      setShowSuccessOverlay(true);
      onSubmit(result);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the challenge: ' + error.message);
    }
  };

  const getParticipantType = (type) => {
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

  const participantTypes = ['All Users', 'Clan(s)', 'Level(s)', 'Specific User(s)'];

  return (
    <div className="overlay-backdrop">
      <div className="create-task-overlay">
        <div className="overlay-header">
          <h2>{isEditing ? 'Update Challenge' : 'Create New Challenge'}</h2>
          <button className="close-button" onClick={onClose}>
            <img src={`${process.env.PUBLIC_URL}/cancel.png`} alt="Cancel" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Challenge Name</label>
            <input
              type="text"
              name="challengeName"
              placeholder="Enter challenge name"
              value={formData.challengeName}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Reward</label>
              <div className="input-with-icon">
                <input
                  type="number"
                  name="challengeReward"
                  placeholder="Enter challenge reward"
                  value={formData.challengeReward}
                  onChange={handleInputChange}
                />
                <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Coin" />
              </div>
            </div>

            <div className="form-field">
              <label>Description</label>
              <textarea
                name="challengeDescription"
                placeholder="Enter challenge description"
                value={formData.challengeDescription}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
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

            <div className="form-field">
              <label>Duration</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  placeholder="HH:MM:SS"
                  value={formData.challengeDuration}
                  readOnly
                />
                <img
                  src={`${process.env.PUBLIC_URL}/time.png`}
                  alt="Time"
                  onClick={() => setShowTimePicker(!showTimePicker)}
                />
                {showTimePicker && (
                  <div className="time-picker-container">
                    <CustomTimePicker />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Participant</label>
              <select
                name="participantType"
                value={formData.participantType}
                onChange={(e) => handleParticipantSelection(e.target.value)}
                className="form-select"
              >
                <option value="">Select participant type</option>
                {participantTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            {renderParticipantField()}
          </div>

          <div className="form-field upload-field">
            <label>Upload Challenge Image</label>
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
              {formData.imagePreview && (
                <div className="image-preview">
                  <img src={formData.imagePreview} alt="Preview" />
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
            <p>Challenge {isEditing ? 'updated' : 'created'} successfully.</p>
            <button className="success-proceed-button" onClick={handleCloseSuccessOverlay}>
              Proceed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateChallengeOverlay;
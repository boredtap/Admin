import React, { useState, useEffect } from 'react';
import './CreateChallengeOverlay.css';

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
    challengeDuration: { hours: 0, minutes: 0, seconds: 0 },
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
  const [error, setError] = useState('');

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
        challengeReward: challengeToEdit.reward?.toString() || '',
        challengeDescription: challengeToEdit.description || '',
        launchDate: challengeToEdit.launch_date ? new Date(challengeToEdit.launch_date) : new Date(),
        challengeDuration: parseDuration(challengeToEdit.duration || '00:00:00'),
        participantType: getParticipantTypeReverse(challengeToEdit.participants || 'all_users'),
        selectedClans: challengeToEdit.participants === 'clan' ? challengeToEdit.participantsDetail || [] : [],
        selectedLevels: challengeToEdit.participants === 'level' ? challengeToEdit.participantsDetail || [] : [],
        specificUsers: challengeToEdit.participants === 'specific_users' ? (challengeToEdit.participantsDetail?.join(', ') || '') : '',
        image: null,
        imagePreview: challengeToEdit.image_url || ''
      });
    }
  }, [challengeToEdit]);

  const parseDuration = (duration) => {
    const parts = duration.split(':').map(Number);
    return {
      hours: parts[0] || 0,
      minutes: parts[1] || 0,
      seconds: parts[2] || 0
    };
  };

  const formatDuration = (duration) => {
    return `${String(duration.hours).padStart(2, '0')}:${String(duration.minutes).padStart(2, '0')}:${String(duration.seconds).padStart(2, '0')}`;
  };

  const getParticipantTypeReverse = (participants) => {
    switch (participants) {
      case 'all_users': return 'All Users';
      case 'clan': return 'Clan(s)';
      case 'level': return 'Level(s)';
      case 'specific_users': return 'Specific User(s)';
      default: return 'All Users';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDurationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      challengeDuration: {
        ...prev.challengeDuration,
        [field]: Math.max(0, parseInt(value) || 0)
      }
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
            placeholder="Enter users (comma-separated)"
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
      <div className="custom-time-picker modern">
        <div className="time-input-group">
          <input
            type="number"
            min="0"
            max="23"
            value={formData.challengeDuration.hours}
            onChange={(e) => handleDurationChange('hours', e.target.value)}
            placeholder="HH"
            className="time-input"
          />
          <span>:</span>
          <input
            type="number"
            min="0"
            max="59"
            value={formData.challengeDuration.minutes}
            onChange={(e) => handleDurationChange('minutes', e.target.value)}
            placeholder="MM"
            className="time-input"
          />
          <span>:</span>
          <input
            type="number"
            min="0"
            max="59"
            value={formData.challengeDuration.seconds}
            onChange={(e) => handleDurationChange('seconds', e.target.value)}
            placeholder="SS"
            className="time-input"
          />
        </div>
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
    if (!formData.challengeDuration.hours && !formData.challengeDuration.minutes && !formData.challengeDuration.seconds) {
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
        name: encodeURIComponent(formData.challengeName),
        description: encodeURIComponent(formData.challengeDescription),
        launch_date: formData.launchDate.toISOString().split('T')[0],
        reward: formData.challengeReward,
        duration: formatDuration(formData.challengeDuration),
        participants: getParticipantType(formData.participantType),
      });

      // Add appropriate data to the body if needed
      if (formData.participantType === 'Clan(s)') {
        formData.selectedClans.forEach(clan => formDataBody.append('clan', clan));
      } else if (formData.participantType === 'Level(s)') {
        formData.selectedLevels.forEach(level => formDataBody.append('level', level));
      } else if (formData.participantType === 'Specific User(s)') {
        formData.specificUsers.split(',').map(user => user.trim()).forEach(user => formDataBody.append('specific_users', user));
      }

      //append the image only if it exists, and use the correct field name.
      if (formData.image) {
        formDataBody.append('image', formData.image);
      }

      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No access token found');

      const endpoint = isEditing ? 'update_challenge' : 'create_challenge';
      const method = isEditing ? 'PUT' : 'POST';

      console.log('Request URL:', `https://bt-coins.onrender.com/admin/challenge/${endpoint}?${queryParams.toString()}`);
      console.log('Request Body:', Object.fromEntries(formDataBody));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

      const response = await fetch(
        `https://bt-coins.onrender.com/admin/challenge/${endpoint}?${queryParams.toString()}`,
        {
          method: method,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataBody,
          signal: controller.signal,
          mode: 'cors', // Explicitly set mode to cors
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e){
          errorData = {};
        }
        throw new Error(`Network response was not ok: ${errorData.message || errorText || 'Server error'}`);
      }

      const result = await response.json();
      setShowSuccessOverlay(true);
      setError('');
      onSubmit(result);
    } catch (error) {
      if (error.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setError('CORS or network issue. Ensure backend allows your origin or use a proxy.');
      } else {
        console.error('Submission Error:', error);
        setError(error.message);
      }
      alert('An error occurred while submitting the challenge: ' + error.message);
    }
  };

  const getParticipantType = (type) => {
    switch (type) {
      case 'All Users': return 'all_users';
      case 'Clan(s)': return 'clan';
      case 'Level(s)': return 'level';
      case 'Specific User(s)': return 'specific_users';
      default: return 'all_users';
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

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Challenge Name</label>
            <input
              type="text"
              name="challengeName"
              placeholder="Enter challenge name"
              value={formData.challengeName}
              onChange={handleInputChange}
              className="form-input"
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
                  className="form-input"
                />
                <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Coin" className="input-icon" />
              </div>
            </div>

            <div className="form-field">
              <label>Description</label>
              <input
                type="text"
                name="challengeDescription"
                placeholder="Enter challenge description"
                value={formData.challengeDescription}
                onChange={handleInputChange}
                className="form-input"
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
                  value={formData.launchDate.toISOString().split('T')[0]}
                  readOnly
                  className="form-input"
                />
                <img
                  src={`${process.env.PUBLIC_URL}/date.png`}
                  alt="Date"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="input-icon"
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
                  value={formatDuration(formData.challengeDuration)}
                  readOnly
                  className="form-input"
                />
                <img
                  src={`${process.env.PUBLIC_URL}/time.png`}
                  alt="Time"
                  onClick={() => setShowTimePicker(!showTimePicker)}
                  className="input-icon"
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
                className="form-input select"
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
    </div>
  );
};

export default CreateChallengeOverlay;
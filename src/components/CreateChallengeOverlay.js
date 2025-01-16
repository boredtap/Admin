import React, { useState } from 'react';

const clans = ["TON Station", "HiddenCode", "h2o", "Tapper Legends"];
const levels = [
  'All Users', 'Novice-Lv 1', 'Explorer-Lv 2', 'Apprentice-Lv 3',
  'Warrior-Lv 4', 'Master - Lv 5', 'Champion - Lv 6',
  'Tactician- Lv 7', 'Specialist - Lv 8', 'Conqueror -Lv 9',
  'Legend - Lv 10'
];

const CreateChallengeOverlay = ({ onClose }) => { 
  const [formData, setFormData] = useState({
    challengeName: '',
    challengeReward: '',
    challengeDescription: '',
    launchDate: null,
    challengeDuration: null,
    participantType: '',
    selectedClans: [],
    selectedLevels: [],
    specificUsers: '',
    image: null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const participantTypes = ['All Users', 'Clan(s)', 'Level(s)', 'Specific User(s)'];
  const [participantFieldLabel, setParticipantFieldLabel] = useState('');
  const [showDropdown, setShowDropdown] = useState({ clans: false, levels: false });

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
    // Set the label based on the participant type
    switch (type) {
      case 'Clan(s)':
        setParticipantFieldLabel('Clan(s)');
        break;
      case 'Level(s)':
        setParticipantFieldLabel('Level(s)');
        break;
      case 'Specific User(s)':
        setParticipantFieldLabel('Specific User(s)');
        break;
      default:
        setParticipantFieldLabel('');
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

  const renderParticipantField = () => {
    if (!participantFieldLabel) return null;

    let content;
    switch (participantFieldLabel) {
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
        <label>{participantFieldLabel}</label>
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

  const handleTimeChange = (time) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const now = new Date();
    const durationDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);
    setFormData(prev => ({
      ...prev,
      challengeDuration: durationDate
    }));
    setShowTimePicker(false);
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

  const CustomTimePicker = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const seconds = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const selectedTime = formData.challengeDuration || new Date();

    return (
      <div className="custom-time-picker" style={{ background: 'white', borderRadius: '8px', padding: '16px', zIndex: '1000' }}>
        <div className="time-picker-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Select Time</span>
        </div>
        <div className="time-selector" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <select 
            style={{ flex: 1, marginRight: '5px' }}
            value={selectedTime.getHours().toString().padStart(2, '0')} 
            onChange={(e) => handleTimeChange(`${e.target.value}:${selectedTime.getMinutes().toString().padStart(2, '0')}:${selectedTime.getSeconds().toString().padStart(2, '0')}`)}
          >
            {hours.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
          :
          <select 
            style={{ flex: 1, margin: '0 5px' }}
            value={selectedTime.getMinutes().toString().padStart(2, '0')} 
            onChange={(e) => handleTimeChange(`${selectedTime.getHours().toString().padStart(2, '0')}:${e.target.value}:${selectedTime.getSeconds().toString().padStart(2, '0')}`)}
          >
            {minutes.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          :
          <select 
            style={{ flex: 1, marginLeft: '5px' }}
            value={selectedTime.getSeconds().toString().padStart(2, '0')} 
            onChange={(e) => handleTimeChange(`${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}:${e.target.value}`)}
          >
            {seconds.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
    );
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

  return (
    <div className="overlay-backdrop">
      <div className="create-task-overlay">
        <div className="overlay-header">
          <h2>Create New Challenge</h2>
          <button className="close-button" onClick={onClose}>
            <img src={`${process.env.PUBLIC_URL}/cancel.png`} alt="Cancel" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); console.log(formData); }}>
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
              <label>Challenge Reward</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  name="challengeReward"
                  placeholder="Enter challenge reward"
                  value={formData.challengeReward}
                  onChange={handleInputChange}
                />
                <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Coin" />
              </div>
            </div>

            <div className="form-field">
              <label>Challenge Description</label>
              <input
                type="text"
                name="challengeDescription"
                placeholder="Enter challenge description"
                value={formData.challengeDescription}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Challenge Launch Date</label>
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
              <label>Challenge Duration</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  placeholder="HH:MM:SS"
                  value={formData.challengeDuration ? 
                    `${formData.challengeDuration.getHours().toString().padStart(2, '0')}:${formData.challengeDuration.getMinutes().toString().padStart(2, '0')}:${formData.challengeDuration.getSeconds().toString().padStart(2, '0')}` 
                    : ''
                  }
                  readOnly
                />
                <img src={`${process.env.PUBLIC_URL}/time.png`} alt="Time" onClick={() => setShowTimePicker(!showTimePicker)} />
                {showTimePicker && (
                  <div className="time-picker-container" style={{ position: 'absolute', top: '100%', left: 0, zIndex: 1000, marginTop: '4px' }}>
                    <CustomTimePicker />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Update the form row for participant selection */}
          <div className="form-row">
            <div className="form-field">
              <label>Challenge Participant</label>
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

export default CreateChallengeOverlay;
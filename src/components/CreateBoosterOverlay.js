import React, { useState, useEffect } from 'react';
import './CreateBoosterOverlay.css';

const boosterLevels = Array.from({ length: 10 }, (_, i) => i + 1);

const CreateBoosterOverlay = ({ onClose, boosterToEdit, onSubmit, isEditing }) => {
  const [formData, setFormData] = useState({
    boosterName: '',
    boosterDescription: '',
    boosterLevel: '',
    boosterUpgradeCost: '',
    boosterEffect: '',
    boosterCondition: '',
    image: null,
    imagePreview: ''
  });

  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (boosterToEdit) {
      setFormData({
        boosterName: boosterToEdit.name || '',
        boosterDescription: boosterToEdit.description || '',
        boosterLevel: boosterToEdit.level || '',
        boosterUpgradeCost: boosterToEdit.upgrade_cost?.toString() || '',
        boosterEffect: boosterToEdit.effect || '',
        boosterCondition: boosterToEdit.condition || '',
        image: null,
        imagePreview: boosterToEdit.image_id ? `https://bt-coins.onrender.com/image/${boosterToEdit.image_id}` : ''
      });
    }
  }, [boosterToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLevelSelection = (level) => {
    setFormData(prev => ({
      ...prev,
      boosterLevel: level
    }));
    setShowLevelDropdown(false);
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

  const validateFormData = () => {
    if (!formData.boosterName.trim()) {
      alert('Please enter a booster name.');
      return false;
    }
    if (!formData.boosterDescription.trim()) {
      alert('Please enter a booster description.');
      return false;
    }
    if (!formData.boosterLevel) {
      alert('Please select a booster level.');
      return false;
    }
    if (!formData.boosterUpgradeCost || isNaN(Number(formData.boosterUpgradeCost))) {
      alert('Please enter a valid upgrade cost.');
      return false;
    }
    if (!formData.boosterEffect.trim()) {
      alert('Please enter a booster effect.');
      return false;
    }
    if (!formData.boosterCondition.trim()) {
      alert('Please enter a booster condition.');
      return false;
    }
    if (!formData.image && !formData.imagePreview) {
      alert('Please upload an image for the booster.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called');
    console.log('Form Data:', formData);

    if (!validateFormData()) return;

    try {
      const queryParams = new URLSearchParams({
        name: formData.boosterName,
        description: formData.boosterDescription,
        level: formData.boosterLevel,
        effect: formData.boosterEffect,
        upgrade_cost: formData.boosterUpgradeCost,
        condition: formData.boosterCondition
      });

      const formDataBody = new FormData();
      if (formData.image) {
        formDataBody.append('image', formData.image);
      }

      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No access token found');

      const endpoint = isEditing ? 'edit_extra_boost' : 'create_extra_boost';
      const method = isEditing ? 'PUT' : 'POST';
      const url = `https://bt-coins.onrender.com/admin/boost/${endpoint}?${queryParams.toString()}${isEditing ? `&extra_boost_id=${boosterToEdit.id}` : ''}`;
      console.log('Submitting to URL:', url);

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataBody,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('Success Response:', result);
      setShowSuccessOverlay(true); // Set this first
      onSubmit(result); // Call parent callback
      console.log('showSuccessOverlay set to true');
    } catch (error) {
      console.error('Submission Error:', error);
      setError(error.message);
      alert('An error occurred while submitting the booster: ' + error.message);
    }
  };

  const handleCloseSuccessOverlay = () => {
    setShowSuccessOverlay(false);
    onClose(); // Close the entire overlay only after user interaction
  };

  console.log('Rendering, showSuccessOverlay:', showSuccessOverlay);

  return (
    <div className="overlay-backdrop">
      <div className="create-booster-overlay">
        <div className="overlay-header">
          <h2>{isEditing ? 'Update Extra Booster' : 'Create Extra Booster'}</h2>
          <button className="close-button" onClick={onClose}>
            <img src={`${process.env.PUBLIC_URL}/cancel.png`} alt="Cancel" />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Booster Name</label>
            <input
              type="text"
              name="boosterName"
              placeholder="Enter booster name"
              value={formData.boosterName}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Booster Description</label>
              <input
                type="text"
                name="boosterDescription"
                placeholder="Enter booster description"
                value={formData.boosterDescription}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label>Booster Level</label>
              <div className="dropdown-container">
                <div
                  className="dropdown-toggle"
                  onClick={() => setShowLevelDropdown(!showLevelDropdown)}
                >
                  {formData.boosterLevel || 'Select Level'}
                  <span className="dropdown-icon">▼</span>
                </div>
                {showLevelDropdown && (
                  <div className="dropdown-menu">
                    {boosterLevels.map((level) => (
                      <div
                        key={level}
                        className="dropdown-item"
                        onClick={() => handleLevelSelection(level)}
                      >
                        Level {level}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Booster Upgrade Cost</label>
              <div className="input-with-icon">
                <input
                  type="number"
                  name="boosterUpgradeCost"
                  placeholder="Enter upgrade cost"
                  value={formData.boosterUpgradeCost}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Coin" className="input-icon" />
              </div>
            </div>
            <div className="form-field">
              <label>Booster Effect</label>
              <input
                type="text"
                name="boosterEffect"
                placeholder="Enter booster effect (e.g., +5)"
                value={formData.boosterEffect}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-field">
            <label>Booster Condition</label>
            <input
              type="text"
              name="boosterCondition"
              placeholder="Enter booster condition"
              value={formData.boosterCondition}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-field upload-field">
            <label>Upload Booster Image</label>
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
              <p>Booster {isEditing ? 'updated' : 'created'} successfully.</p>
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

CreateBoosterOverlay.defaultProps = {
  onSubmit: () => {},
};

export default CreateBoosterOverlay;
import React, { useState, useEffect } from 'react';
import './CreateLevelOverlay.css';

const CreateLevelOverlay = ({ onClose, levelToEdit, onSubmit, isEditing }) => {
  const [formData, setFormData] = useState({
    levelName: '',
    levelRequirement: '',
    levelValue: '', // This will be the level number
    badgeImage: null,
  });

  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // For displaying backend errors

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (levelToEdit) {
      setFormData({
        levelName: levelToEdit.name || '',
        levelRequirement: levelToEdit.requirement?.toString() || '', // Convert to string for input
        levelValue: levelToEdit.level?.toString() || '', // Convert to string for input
        badgeImage: null, // New image upload, or use existing if needed
      });
    }
  }, [levelToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        badgeImage: file
      }));
    }
  };

  const validateFormData = () => {
    if (!formData.levelName.trim()) {
      alert('Please enter a level name.');
      return false;
    }
    if (!formData.levelRequirement || isNaN(Number(formData.levelRequirement))) {
      alert('Please enter a valid numeric level requirement.');
      return false;
    }
    if (!formData.levelValue || isNaN(Number(formData.levelValue))) {
      alert('Please enter a valid numeric level value.');
      return false;
    }
    if (!formData.badgeImage) {
      alert('Please upload a badge image for the level.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateFormData()) return;
  
    try {
      const formDataBody = new FormData();
      formDataBody.append('badge', formData.badgeImage); // Match backend field name
  
      const queryParams = new URLSearchParams({
        name: encodeURIComponent(formData.levelName), // Still encode for URL safety
        level: formData.levelValue, // Ensure this is a number or string
        requirement: formData.levelRequirement, // Ensure this is a number or string
      });
  
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No access token found');
  
      const endpoint = isEditing ? 'update_level' : 'create_level';
      const method = isEditing ? 'PUT' : 'POST';
  
      console.log('Submitting to:', `https://bt-coins.onrender.com/admin/levels/${endpoint}?${queryParams.toString()}`);
      console.log('Form Data:', Object.fromEntries(formDataBody));
  
      const response = await fetch(
        `https://bt-coins.onrender.com/admin/levels/${endpoint}?${queryParams.toString()}`,
        {
          method: method,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataBody,
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        const errorData = JSON.parse(errorText || '{}');
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || errorText || 'Unknown error'}`);
      }
  
      const result = await response.json();
      console.log('Success Response:', result);
  
      // Decode the name if the backend returned it encoded
      const decodedLevelName = decodeURIComponent(result.name || formData.levelName);
      const newLevel = {
        id: result.id,
        name: decodedLevelName, // Use decoded name
        level: Number(result.level),
        requirement: Number(result.requirement),
        badge_id: result.badge_id,
      };
  
      setShowSuccessOverlay(true);
      setErrorMessage('');
      onSubmit(newLevel);
    } catch (error) {
      console.error('Error Details:', error);
      setErrorMessage(error.message);
      alert('Failed to ' + (isEditing ? 'update' : 'create') + ' level: ' + error.message);
    }
  };

  const handleCloseSuccessOverlay = () => {
    setShowSuccessOverlay(false);
    onClose();
  };

  return (
    <div className="overlay-backdrop">
      <div className="create-level-overlay">
        <div className="overlay-header">
          <h2 className="overlay-title">Create New Level</h2>
          <button className="close-button" onClick={onClose}>
            <img src={`${process.env.PUBLIC_URL}/cancel.png`} alt="Close" />
          </button>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          {/* Level Name */}
          <div className="form-field">
            <label>Level Name</label>
            <input
              type="text"
              name="levelName"
              placeholder="Enter level name"
              value={formData.levelName}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          {/* Level Requirement and Level on the same row */}
          <div className="form-row">
            <div className="form-field">
              <label>Level Requirement</label>
              <div className="input-with-icon">
                <input
                  type="number"
                  name="levelRequirement"
                  placeholder="Enter requirement (e.g., coins)"
                  value={formData.levelRequirement}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Coin" className="input-icon" />
              </div>
            </div>

            <div className="form-field">
              <label>Level</label>
              <input
                type="number"
                name="levelValue"
                placeholder="Enter level (e.g., 1)"
                value={formData.levelValue}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Upload Level Badge */}
          <div className="form-field upload-field">
            <label>Upload Level Badge</label>
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
              {formData.badgeImage && (
                <div className="image-preview">
                  <img src={URL.createObjectURL(formData.badgeImage)} alt="Badge Preview" />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>

        {/* Success Overlay */}
        {showSuccessOverlay && (
          <div className="success-overlay">
            <div className="success-content">
              <img className="success-icon" src={`${process.env.PUBLIC_URL}/success.png`} alt="Success" />
              <h2>Success!</h2>
              <p>Level {isEditing ? 'updated' : 'created'} successfully.</p>
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

export default CreateLevelOverlay;
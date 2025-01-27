import React from 'react';
import './SuccessOverlay.css';

const SuccessOverlay = ({ onClose }) => {
  return (
    <div className="success-overlay">
      <div className="success-content">
        <img src={`${process.env.PUBLIC_URL}/success.png`} alt="Success" className="success-icon" />
        <h2>Successful</h2>
        <p>You have successfully logged in.</p>
        <button className="proceed-button" onClick={onClose}>Proceed</button>
      </div>
    </div>
  );
};

export default SuccessOverlay;
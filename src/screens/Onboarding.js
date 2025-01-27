import React, { useState, useEffect } from 'react';
import './Onboarding.css';
import SignIn from './SignIn';
import SuccessOverlay from './SuccessOverlay';

const Onboarding = () => {
  const [loading, setLoading] = useState(true);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setShowSignIn(true);
    }, 2000); // Simulate loading for 2 seconds
  }, []);

  const handleSignInSuccess = () => {
    setShowSuccessOverlay(true);
  };

  return (
    <div className="onboarding-container">
      {loading && (
        <div className="loading-screen">
          <center><img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="logo2" /></center>
          <h1 className="app-name">BoredTap App</h1>
          <div className="loader"></div>
        </div>
      )}
      {showSignIn && <SignIn onSignInSuccess={handleSignInSuccess} />}
      {showSuccessOverlay && <SuccessOverlay onClose={() => setShowSuccessOverlay(false)} />}
    </div>
  );
};

export default Onboarding;
import React, { useState } from 'react';
import './SignIn.css';
import { useNavigate } from 'react-router-dom';

const SignIn = ({ onSignInSuccess }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://bored-tap-api.onrender.com/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'password',
          username: userId,
          password: password,
          scope: '',
          client_id: 'string',
          client_secret: 'string',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        onSignInSuccess();
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="sign-in-container">
      <div className="header">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="logo" />
        <h1 className="app-name2">BoredTap App</h1>
      </div>
      <h2 className="welcome-text">Welcome Admin!</h2>
      <form onSubmit={handleSignIn}>
        <div className="form-field">
          <label>User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="sign-in-button">Log In</button>
      </form>
    </div>
  );
};

export default SignIn;
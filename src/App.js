import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './screens/Dashboard';
import Tasks from './screens/Tasks';
import Rewards from './screens/Rewards';
import Challenges from './screens/Challenges';
import Clans from './screens/Clans';
import Leaderboard from './screens/Leaderboard';
import Boosts from './screens/Boosts';
import Levels from './screens/Levels';
import Users from './screens/Users';
import Security from './screens/Security';
import Onboarding from './screens/Onboarding';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/clans" element={<Clans />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/boosts" element={<Boosts />} />
        <Route path="/levels" element={<Levels />} />
        <Route path="/users" element={<Users />} />
        <Route path="/security" element={<Security />} />
      </Routes>
    </Router>
  );
};

export default App;
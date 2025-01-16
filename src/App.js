import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './screens/Dashboard';  // Assuming you have this component created
import Tasks from './screens/Tasks';
import Rewards from './screens/Rewards';
import Challenges from './screens/Challenges';
import Clans from './screens/Clans';
import Leaderboard from './screens/Leaderboard';
import Boosts from './screens/Boosts';
import Levels from './screens/Levels';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Tasks" element={<Tasks />} />
        <Route path="/Rewards" element={<Rewards />} />
        <Route path="/Challenges" element={<Challenges />} />
        <Route path="/Clans" element={<Clans />} />
        <Route path="/Leaderboard" element={<Leaderboard />} />
        <Route path="/Boosts" element={<Boosts />} />
        <Route path="/Levels" element={<Levels />} />
            {/* Add other routes here */}
          </Routes>
    </Router>
  );
}

export default App;

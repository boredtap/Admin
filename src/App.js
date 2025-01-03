import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './screens/Dashboard';  // Assuming you have this component created
<<<<<<< HEAD
import Tasks from './screens/Tasks';
import Rewards from './screens/Rewards';
import Challenges from './screens/Challenges';
=======
>>>>>>> 276fc0966a98df77bcd4a6ad8d4ededc8e50ed49

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
<<<<<<< HEAD
        <Route path="/Tasks" element={<Tasks />} />
        <Route path="/Rewards" element={<Rewards />} />
        <Route path="/Challenges" element={<Challenges />} />
=======
>>>>>>> 276fc0966a98df77bcd4a6ad8d4ededc8e50ed49
            {/* Add other routes here */}
          </Routes>
    </Router>
  );
}

export default App;

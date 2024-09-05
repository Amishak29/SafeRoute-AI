import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Zone from './components/Zone';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for the Landing Page */}
          <Route
            path="/"
            element={
              <div className="welcome-container">
                <h1>Welcome to SafeRoute AI</h1>
                <Link to="/zone">
                  <button className="animated-button">Go to Zones</button>
                </Link>
              </div>
            }
          />
          
          {/* Route for the Zone Component */}
          <Route path="/zone" element={<Zone />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

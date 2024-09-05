import React, { useState } from 'react';
import './Zone.css';

const zones = ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6'];
const priorities = ['Traffic', 'AQI-based', 'Safety'];
const weatherOptions = ['Cloudy', 'Rainy', 'Clear'];

const Zone = () => {
  const [startZone, setStartZone] = useState('');
  const [endZone, setEndZone] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [priority, setPriority] = useState('');
  const [weather, setWeather] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [searchResult, setSearchResult] = useState(null); // To store the final object

  // Function to capture date, time, and day
  const getCurrentTimestamp = () => {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    return { date, time, day };
  };

  const handleDisplay = () => {
    const timestampObj = getCurrentTimestamp();
    setTimestamp(`Date: ${timestampObj.date}, Time: ${timestampObj.time}, Day: ${timestampObj.day}`);
    setDisplayText(`Start: ${startZone} | End: ${endZone}`);
  };

  const handleMoreDetails = () => {
    setShowDetails(true);
    const timestampObj = getCurrentTimestamp();
    setTimestamp(`Date: ${timestampObj.date}, Time: ${timestampObj.time}, Day: ${timestampObj.day}`);
  };

  // Function to handle "Search Routes" click and create the object
  const handleSearchRoutes = () => {
    const routeDetails = {
      startZone,
      endZone,
      priority,
      weather,
      timestamp: getCurrentTimestamp(),
    };

    setSearchResult(routeDetails); // Set the object to display
  };

  return (
    <div className="zone-container">
      <h2>Select Start and End Zones</h2>
      <div className="dropdowns">
        <div className="dropdown">
          <label>Start Zone:</label>
          <select value={startZone} onChange={(e) => setStartZone(e.target.value)}>
            <option value="" disabled>Select start zone</option>
            {zones.map((zone, index) => (
              <option key={index} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>

        <div className="dropdown">
          <label>End Zone:</label>
          <select value={endZone} onChange={(e) => setEndZone(e.target.value)}>
            <option value="" disabled>Select end zone</option>
            {zones.map((zone, index) => (
              <option key={index} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button className="display-button" onClick={handleDisplay}>
        Display Zones
      </button>

      <div className="textbox">
        <p>{displayText}</p>
        <p>{timestamp}</p> {/* Display the captured time, date, and day */}
      </div>

      <button className="more-details-button" onClick={handleMoreDetails}>
        Add More Details
      </button>

      {showDetails && (
        <div className="more-details">
          <div className="dropdown">
            <label>Priority:</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="" disabled>Select priority</option>
              {priorities.map((priority, index) => (
                <option key={index} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          <div className="dropdown">
            <label>Weather:</label>
            <select value={weather} onChange={(e) => setWeather(e.target.value)}>
              <option value="" disabled>Select weather</option>
              {weatherOptions.map((weather, index) => (
                <option key={index} value={weather}>
                  {weather}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* New button to create and display the final object */}
      <button className="search-button" onClick={handleSearchRoutes}>
        Search Routes
      </button>

      {/* Display the final object */}
      {searchResult && (
        <div className="search-result">
          <h3>Route Details</h3>
          <pre>{JSON.stringify(searchResult, null, 2)}</pre> {/* Pretty print the object */}
        </div>
      )}
    </div>
  );
};

export default Zone;

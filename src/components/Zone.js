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
  const [searchResult, setSearchResult] = useState(null);
  const [currentTemperature, setCurrentTemperature] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const [manualTemperature, setManualTemperature] = useState('');
  const [fetching, setFetching] = useState(false); 
  const [citySuggestions, setCitySuggestions] = useState([]); 
  const [selectedCity, setSelectedCity] = useState('');

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

  const fetchWeatherByCoordinates = async (latitude, longitude) => {
    const apiKey = '22c13c85c39279222aa75aac72be8ca7'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    setCurrentTemperature(`${data.main.temp} °C`);
  };

  const fetchWeatherByLocation = async (location) => {
    const apiKey = '22c13c85c39279222aa75aac72be8ca7'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;

    try {
      setFetching(true); 
      const response = await fetch(url);
      const data = await response.json();

      if (data.main && data.main.temp) {
        setManualTemperature(`${data.main.temp} °C`);
      } else {
        setManualTemperature('Temperature data not available');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setManualTemperature('Error fetching temperature');
    } finally {
      setFetching(false);
    }
  };
  const fetchCitySuggestions = async (input) => {
    const apiKey = '22c13c85c39279222aa75aac72be8ca7'; // Replace with your OpenWeatherMap API key
    const url = `http://api.openweathermap.org/data/2.5/find?q=${input}&type=like&sort=population&cnt=5&appid=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setCitySuggestions(data.list.map(city => city.name));
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
    }
  };
  const handleCityInputChange = (e) => {
    const input = e.target.value;
    setManualLocation(input);
    if (input.length >= 3) {
      fetchCitySuggestions(input);
    } else {
      setCitySuggestions([]);
    }
  };
  const handleSuggestionClick = (city) => {
    setSelectedCity(city);
    setManualLocation(city);
    setCitySuggestions([]); 
  };
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleMoreDetails = () => {
    setShowDetails(true);
    const timestampObj = getCurrentTimestamp();
    setTimestamp(`Date: ${timestampObj.date}, Time: ${timestampObj.time}, Day: ${timestampObj.day}`);

    getCurrentLocation();
  };

  const handleSearchRoutes = () => {
    const routeDetails = {
      startZone,
      endZone,
      priority,
      weather,
      timestamp: getCurrentTimestamp(),
      currentTemperature,
      manualTemperature,
      manualLocation: selectedCity || manualLocation, 
    };

    setSearchResult(routeDetails);
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
        <p>{timestamp}</p>
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

          <div>
            <p>Current Location Temperature: {currentTemperature}</p>
          </div>

          <div className="manual-location">
            <label>Enter Location: </label>
            <input
              type="text"
              value={manualLocation}
              onChange={handleCityInputChange}
              placeholder="Enter city"
            />
            <ul className="city-dropdown">
              {citySuggestions.map((city, index) => (
                <li key={index} onClick={() => handleSuggestionClick(city)}>
                  {city}
                </li>
              ))}
            </ul>
            <button
              className="fetch-button"
              onClick={() => fetchWeatherByLocation(manualLocation)}
              disabled={fetching} 
            >
              {fetching ? 'Fetching...' : 'Fetch Temperature'}
            </button>
            {manualTemperature && <p>Temperature for {manualLocation}: {manualTemperature}</p>}
          </div>
        </div>
      )}

      <button className="search-button" onClick={handleSearchRoutes}>
        Search Routes
      </button>

      {searchResult && (
        <div className="search-result">
          <h3>Route Details</h3>
          <pre>{JSON.stringify(searchResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Zone;

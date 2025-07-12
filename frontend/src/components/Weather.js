import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Weather.css"; // Import CSS for styling

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("New Delhi"); // Default city
  const API_KEY = "243290ab911900ab282e96de583bac16";

  // Memoized function to fetch weather data
  const fetchWeather = useCallback(async () => {
    try {
      const currentWeatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );

      setWeather(currentWeatherRes.data);
      setForecast(forecastRes.data.list.slice(0, 5)); 
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }, [city, API_KEY]); 

  useEffect(() => {
    fetchWeather(); 
    const interval = setInterval(fetchWeather, 300000); 

    return () => clearInterval(interval); 
  }, [fetchWeather]); 

  return (
    <div className="main-container">
    <div className="weather-container">
      <h2>Weather Forecast</h2>
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather}>Search</button>
      </div>

      {weather ? (
        <div className="weather-info">
          <h3>Current Weather in {weather.name}</h3>
          <p>🌡 Temperature: {weather.main.temp}°C</p>
          <p>🌬 Wind Speed: {weather.wind.speed} m/s</p>
          <p>☁ Condition: {weather.weather[0].description}</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}

      {forecast.length > 0 && (
        <div className="forecast-container">
          <h3>5-Day Forecast</h3>
          <div className="forecast">
            {forecast.map((item, index) => (
              <div key={index} className="forecast-item">
                <p>{new Date(item.dt * 1000).toLocaleDateString()}</p>
                <p>🌡 {item.main.temp}°C</p>
                <p>☁ {item.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Weather;

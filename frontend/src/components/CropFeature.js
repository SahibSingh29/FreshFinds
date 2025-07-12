import React, { useState } from 'react';
import './CropFeature.css';

const CropFeature = () => {
  const [cropName, setCropName] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCropName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setPrediction(null);
    setError(null);

    if (!cropName) {
      setError('Please enter a crop name');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/predict-crop/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ crop: cropName }),
      });

      const result = await response.json();

      if (response.ok) {
        setPrediction(result);
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to fetch data from server');
    }
  };

  return (
    <div className='main-pred'>

    <div className="crop-predictor">
      <h2 className='crop-head'>Crop Prediction</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="input-container">
          <label htmlFor="crop-name">Enter Crop Name : </label>
          <input
            type="text"
            id="crop-name"
            value={cropName}
            onChange={handleChange}
            placeholder="E.g. Wheat, Rice"
          />
        </div>

        <button type="submit" className="submit-btn">Predict</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {prediction && (
        <div className="prediction-results">
          <h3>Prediction Results</h3>
          <ul>
            <li><strong>Region:</strong> {prediction.Region}</li>
            <li><strong>Soil Type:</strong> {prediction.Soil_Type}</li>
            <li><strong>Rainfall (mm):</strong> {prediction.Rainfall_mm}</li>
            <li><strong>Temperature (°C):</strong> {prediction.Temperature_Celsius}</li>
            <li><strong>Fertilizer Used:</strong> {prediction.Fertilizer_Used ? 'Yes' : 'No'}</li>
            <li><strong>Irrigation Used:</strong> {prediction.Irrigation_Used ? 'Yes' : 'No'}</li>
            <li><strong>Weather Condition:</strong> {prediction.Weather_Condition}</li>
          </ul>
        </div>
      )}
    </div>
    </div>
  );
};

export default CropFeature;

import React, { useState } from 'react';
import './CropForm.css';

function CropForm() {
    const [formData, setFormData] = useState({
        N: '',
        P: '',
        K: '',
        temperature: '',
        humidity: '',
        ph: '',
        rainfall: ''
    });

    const [result, setResult] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResult('');
        try {
            const response = await fetch('http://localhost:8000/api/recommend-crop/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                setResult(data.recommended_crop);
            } else {
                setResult(`Error: ${data.error}`);
            }
        } catch (err) {
            setResult('Server error. Try again later.');
        }
    };

    const fields = [
        { name: 'N', label: 'Nitrogen (N)' },
        { name: 'P', label: 'Phosphorus (P)' },
        { name: 'K', label: 'Potassium (K)' },
        { name: 'temperature', label: 'Temperature (°C)' },
        { name: 'humidity', label: 'Humidity (%)' },
        { name: 'ph', label: 'pH of soil' },
        { name: 'rainfall', label: 'Rainfall (mm)' },
    ];

    return (
        <div className="crop-form-container">
            <div className="form-card">
                <h2>🌾 Crop Recommendation</h2>
                <form onSubmit={handleSubmit}>
                    {fields.map(field => (
                        <div key={field.name} className="form-group">
                            <label>{field.label}</label>
                            <input
                                type="number"
                                name={field.name}
                                step="any"
                                value={formData[field.name]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}
                    <button type="submit">Get Recommendation</button>
                </form>
                {result && (
                    <div className="result-box">
                        Recommended Crop: <strong>{result}</strong>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CropForm;

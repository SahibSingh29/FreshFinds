import React, { useState } from 'react';
import axios from 'axios';
import './SellCropForm.css'; 
import { useParams } from 'react-router-dom';


const SellCropForm = () => {
  const { vendorId } = useParams();
  console.log("Received vendorId prop:", vendorId); 
  const [form, setForm] = useState({ crop: '', quantity: '', location: '', contact_number: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('access_token'); 
    console.log(token);
    if (!token) {
      alert("You are not logged in.");
      return;
    }
  
    try {
      const { crop, quantity, location, contact_number } = form;
      const response = await axios.post(
        'http://localhost:8000/sell-request/',
        {
          crop,
          quantity,
          location,
          contact_number,
          vendor: vendorId
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Sell request successful:', response.data);
      alert('Request sent successfully!');
    } catch (error) {
      console.error('Error sending request:', error.response?.data, error.response?.status, error.response?.statusText);
      alert('Failed to send sell request');
    }
  };

  return (
    <div className='sell-form'>
    <div className="form-container">
      <h2 className="form-heading">Sell Crop Request</h2>
      <form onSubmit={handleSubmit} className="sell-crop-form">
        <input 
          type="text" 
          placeholder="Crop" 
          className="form-input" 
          onChange={(e) => setForm({...form, crop: e.target.value})} 
        />
        <input 
          type="number" 
          placeholder="Quantity" 
          className="form-input" 
          onChange={(e) => setForm({...form, quantity: e.target.value})} 
        />
        <input 
          type="text" 
          placeholder="Location" 
          className="form-input" 
          onChange={(e) => setForm({...form, location: e.target.value})} 
        />
        <input 
          type="text" 
          placeholder="Contact Number" 
          className="form-input" 
          onChange={(e) => setForm({...form, contact_number: e.target.value})} 
        />
        <button type="submit" className="submit-button">Send Request</button>
      </form>
    </div>
    </div>
  );
};

export default SellCropForm;

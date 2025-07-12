// VendorProfileForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Form.css';

const VendorProfileForm = () => {
  const [data, setData] = useState({
    company_name: '',
    location: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true); // For checking vendor profile
  const navigate = useNavigate();

  useEffect(() => {
    const checkVendorProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8000/check-vendor-profile/', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
          }
        });
        if (response.data.has_profile) {
          navigate('/vendor-dashboard'); 
        } else {
          setLoading(false); 
        }
      } catch (err) {
        console.error('Error checking vendor profile:', err);
        setLoading(false); 
      }
    };

    checkVendorProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/create-vendor-profile/',
        data,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
          }
        }
      );
      alert(response.data.message);
      navigate('/vendor-dashboard'); 
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert('Failed to create vendor profile');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="vendor-form-container">
      <h2>Complete Your Vendor Profile</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          placeholder="Company Name"
          value={data.company_name}
          onChange={(e) => setData({ ...data, company_name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={data.location}
          onChange={(e) => setData({ ...data, location: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default VendorProfileForm;

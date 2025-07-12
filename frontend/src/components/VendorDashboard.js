import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VendorDashboard.css'; // ✅ Import the CSS file

const VendorDashboard = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = sessionStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/vendor-requests/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(response.data);
      } catch (err) {
        console.error('Error fetching vendor requests:', err);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div style={{ background: '#f0fdf4' }}>
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Sell Requests for You</h2>
      <ul className="request-list">
        {requests.map((req) => (
          <li key={req.id} className="request-item">
            <span className="crop-name">{req.crop}</span> - 
            <span className="quantity">{req.quantity} kg</span> from 
            <span className="location"> {req.location}</span> 
            (<span className="contact">{req.contact_number}</span>)
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default VendorDashboard;

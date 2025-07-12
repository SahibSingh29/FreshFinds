import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VendorList.css'; // Import the CSS file

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/vendors/')
      .then(res => setVendors(res.data))
      .catch(error => console.error('Error fetching vendors:', error));
  }, []);

  return (
    <div style={{minHeight:'88vh'}}>
    <div className="vendor-container">
      <h2 className='vendor-head'>Vendors</h2>
      <div className="vendor-list">
        {vendors.map(vendor => (
          <div key={vendor.id} className="vendor-item">
            <div className="vendor-info">
              <h3>{vendor.company_name}</h3>
              <p>{vendor.location}</p>
              <p>{vendor.phone}</p>
            </div>
            <button
              className="sell-crop-button"
              onClick={() => navigate(`/sell-crop/${vendor.id}`)}
            >
              Sell Crop
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default VendorList;

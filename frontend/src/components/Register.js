import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Form.css';

const Register = () => {
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'farmer' 
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/register/', data);
      alert('Registration successful');
      navigate('/login');
    } catch (err) {
      alert('Error: ' + JSON.stringify(err.response?.data || 'Something went wrong'));
    }
  };

  return (
    <div className='main-reg'>
      
      <div className='Wlcm'>
        <h1>Welcome to FreshFinds</h1>
      </div>

    <form onSubmit={handleSubmit} className="register-form">
      <h2>Create an Account</h2>

      <input
        type="text"
        placeholder="Username"
        value={data.username}
        onChange={(e) => setData({ ...data, username: e.target.value })}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
        required
      />

      <select className='role-selector'
        value={data.role}
        onChange={(e) => setData({ ...data, role: e.target.value })}
        required
      >
        <option value="farmer">Farmer</option>
        <option value="vendor">Vendor</option>
      </select>

      <button type="submit">Register</button>

      <p className="form-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </form>
    </div>
  );
};

export default Register;

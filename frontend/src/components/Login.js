import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './LoginForm.css';

const Login = ({ onLogin }) => {
  const [data, setData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/login/', data);
      sessionStorage.setItem('access_token', res.data.access);
      sessionStorage.setItem('role', res.data.role);
      sessionStorage.setItem('username', data.username); 
      onLogin(); 
      navigate('/'); 
    } catch (err) {
      alert('Login failed');
    }
  };


return (
  <div className='main'>
    <div className='Wlcm'>
      <h1>Welcome to FreshFinds</h1>
    </div>
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
        <input
          placeholder="Username"
          onChange={(e) => setData({ ...data, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
          required
        />
      <button type="submit">Login</button>

      <p className="form-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </form>
  </div>
  );
};

export default Login;

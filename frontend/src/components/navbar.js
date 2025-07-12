import React, { useState } from 'react';
import './navbar.css';  
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout, overdueCount }) => {
  const navigate = useNavigate();
  const username = sessionStorage.getItem('username');
  const [isOpen, setIsOpen] = useState(false);  // Toggle state

  const handleLogout = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('username');
    onLogout(); 
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <h2 className="logo"><span className='logo-one'>Fresh</span>Finds</h2>

      <div className="hamburger" onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      <ul className={`nav-links center-links ${isOpen ? "open" : ""}`}>
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsOpen(false)}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/weather" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsOpen(false)}>Weather</NavLink>
        </li>
        <li>
          <NavLink to="/tasklist" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsOpen(false)}>
            TaskList
            {overdueCount > 0 && (
              <span className="notification-badge">{overdueCount}</span>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/predict" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsOpen(false)}>Disease Prediction</NavLink>
        </li>
        <li>
          <NavLink to="/recommend-crop" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsOpen(false)}>Crop Recommendation</NavLink>
        </li>
        <li>
          <NavLink to="/crop-feature" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsOpen(false)}>Crop Features</NavLink>
        </li>
        <li>
          <NavLink to="/vendors" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsOpen(false)}>Vendors</NavLink>
        </li>
      </ul>

      <ul className={`nav-links right-links ${isOpen ? "open" : ""}`}>
        <li><button onClick={() => { handleLogout(); setIsOpen(false); }} className="logout-btn">Logout</button></li>
        {username && <li className="username-display">Hi, {username}</li>}
      </ul>
    </nav>
  );
};

export default Navbar;

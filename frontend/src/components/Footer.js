import React from "react";
import './Footer.css';

const Footer = () => {
    return(
        <footer className="footer-class">
      <p>Copyrights © {new Date().getFullYear()} FreshFinds, All Rights Reserved.</p>
      </footer>
    )
}

export default Footer
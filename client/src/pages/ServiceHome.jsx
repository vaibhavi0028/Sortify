// ServiceHome.jsx
import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import OngoingProcess from './OngoingProcess'; 
import Services from './Services'; 
import '../styles/Services.css';

const ServiceHome = () => {
  return (
    <div className="service-home-container">
      <nav className="service-nav">
        <ul className="service-nav-list">
          <li>
            <Link to="ongoing" className="service-link">Ongoing Processes</Link>
          </li>
          <li>
            <Link to="request" className="service-link">Request Service</Link>
          </li>
        </ul>
      </nav>

      <div className="service-content">
        <Routes>
          <Route path="ongoing" element={<OngoingProcess />} />
          <Route path="request" element={<Services />} />
        </Routes>
      </div>
    </div>
  );
};

export default ServiceHome;

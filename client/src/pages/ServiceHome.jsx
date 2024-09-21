// ServiceHome.jsx
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import OngoingProcess from './OngoingProcess'; 
import Services from './Services'; 
import '../styles/Services.css';

const ServiceHome = () => {
  const location = useLocation();

  // Check if the current path is either ongoing or request
  const isOngoing = location.pathname.includes("ongoing");
  const isRequest = location.pathname.includes("request");

  return (
    <div className="service-home-container">
      {!isOngoing && !isRequest && (
        <div className="">
        <h1 style={{ fontSize: '40px', textDecoration: 'underline' }} className="servicesh1">
  Hostel Services
</h1>

        <div className="service-boxes">
          
          <div className="service-box ongoing" onClick={() => window.location.href = '/services/ongoing'}>
            <div className="overlay">
              <h2>Ongoing Processes</h2>
            </div>
          </div>
          <div className="service-box request" onClick={() => window.location.href = '/services/request'}>
            <div className="overlay">
              <h2>Request Service</h2>
            </div>
          </div>
        </div>
        </div>
      )}

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

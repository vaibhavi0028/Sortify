// ServiceHome.js
import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import OngoingProcess from './OngoingProcess'; // Adjust the path as needed
import Services from './Services'; // Adjust the path as needed

const ServiceHome = () => {
  return (
    <div className="service-home-container">
      <nav>
        <ul>
          <li>
            <Link to="ongoing">Ongoing Processes</Link> {/* Relative path */}
          </li>
          <li>
            <Link to="request">Request Service</Link> {/* Change this path if needed */}
          </li>
        </ul>
      </nav>

      <div className="content">
        <Routes>
          <Route path="ongoing" element={<OngoingProcess />} />
          <Route path="request" element={<Services />} /> {/* Adjust as needed */}
        </Routes>
      </div>
    </div>
  );
};

export default ServiceHome;

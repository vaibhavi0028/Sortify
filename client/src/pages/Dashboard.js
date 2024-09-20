import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Home.css"; 

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="greeting">
        <h1>Hello, <strong>Name!</strong></h1>
        <hr />
      </div>

      <div className="box-container">
        <div className="box box1">
          <NavLink to="/segregation" className="box-content">
            <h2>Mail Segregation</h2>
          </NavLink>
        </div>
        <div className="box box2">
          <NavLink to="/generator" className="box-content">
            <h2>Mail Generator</h2>
          </NavLink>
        </div>
        <div className="box box3">
          <NavLink to="/complaints" className="box-content">
            <h2>Complaints</h2>
          </NavLink>
        </div>
        <div className="box box4">
          <NavLink to="/services" className="box-content">
            <h2>Services</h2>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

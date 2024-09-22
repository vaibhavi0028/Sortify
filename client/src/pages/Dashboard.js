import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Dashboard.css";
import Avatar from "../assets/avatar.svg";

function Dashboard() {
  const important = [
    "Internship at CropSky",
    "Accenture Innovation Challenge",
    "TCS CodeVita",
    "Calls for interns",
    "Poster Competition",
    "mail 6",
  ];

  const events = ["Events by clubs", "Sports Event", "Accenture Innovation Challenge", "Gravitas Team"];

  const handleMouseOver = (e) => {
    const marquee = e.currentTarget;
    marquee.stop();
  };

  const handleMouseOut = (e) => {
    const marquee = e.currentTarget;
    marquee.start();
  };

  return (
    <div className="dashboard">
      <div className="left-container">
        <div className="greeting">
          <h1>
            Hello, <strong>Vaibhavi!</strong>
          </h1>
          <hr />
        </div>
        <div className="profile-card">
          <img src={Avatar} alt="Avatar" className="avatar" />
          <div className="profile-info">
            <p>
              <strong>Registration No.:</strong> 22MIC0046
            </p>
            <p>
              <strong>Name:</strong> Vaibhavi
            </p>
            <p>
              <strong>Email:</strong> vaibhavi.2022a@vitstudent.ac.in
            </p>
          </div>
        </div>

        <div className="notices-wrapper">
          <div className="notices-box">
            <h2>Important mails</h2>
            <marquee
              className="notices-marquee"
              direction="up"
              behavior="scroll"
              scrollamount="2"
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              {important.map((imp, index) => (
                <p key={index} className="notice-item">
                  {imp}
                </p>
              ))}
            </marquee>
          </div>
          <div className="notices-box">
            <h2>Today's mails</h2>
            <marquee
              className="notices-marquee"
              direction="up"
              behavior="scroll"
              scrollamount="2"
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              {events.map((event, index) => (
                <p key={index} className="notice-item">
                  {event}
                </p>
              ))}
            </marquee>
          </div>
        </div>

        
      </div>
      <div className="right-container">
      <div className="outer-box-container">
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
        
      </div>
    </div>
  );
}

export default Dashboard;

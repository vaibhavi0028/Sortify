import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import {
  faMoon,
  faSun,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";
import logodark from "../assets/logodark.png";
import "../styles/Navbar.css";
import { NavLink } from "react-router-dom";
import Avatar from "../assets/avatar.svg";

function Navbar({ darkMode, setDarkMode }) {
  const [sidebarActive, setSidebarActive] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", headerShadow);
    return () => window.removeEventListener("scroll", headerShadow);
  }, []);

  function headerShadow() {
    const navHeader = document.getElementById("header");
    const navLogoImg = document.querySelector(".nav-logo-img");
    if (window.scrollY > 50) {
      navHeader.style.boxShadow = "5px 0 20px rgba(0, 0, 0, 0.6)";
      navHeader.style.height = "70px";
      navHeader.style.lineHeight = "70px";
      navLogoImg.style.height = "60px";
    } else {
      navHeader.style.boxShadow = "none";
      navHeader.style.height = "90px";
      navHeader.style.lineHeight = "90px";
      navLogoImg.style.height = "80px";
    }
  }

  function toggleSidebar() {
    setSidebarActive(!sidebarActive);
  }

  function closeSidebar() {
    setSidebarActive(false);
  }

  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPath = location.pathname.includes("/auth");

  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignInClick = () => {
    navigate("/auth/signin");
  };

  const handleAvatarClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleProfileClick = () => {
    navigate("/dashboard");
    setShowDropdown(false);
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
    setShowDropdown(false);
  };

  const handleLogoutClick = () => {
    navigate("/");
    setShowDropdown(false);
  };

  return (
    <nav id="header">
      <div className="nav-logo" onClick={() => navigate("/")}>
        <img src={darkMode ? logo : logodark} alt="Logo" className="nav-logo-img" />
        <div className="nav-name-container">
          <p className="nav-name n1">Sortify</p>
        </div>
      </div>
      <div
        className={`nav-menu ${sidebarActive ? "active" : ""}`}
        id="myNavMenu"
      >
        <ul className="nav_menu_list">
          {[
            "home",
            "Mail Segregation",
            "Mail Generator",
            "Complaints",
            "Services",
          ].map((section) => {
            const words = section.split(" ");
            const linkPath =
              words.length > 1
                ? words[1].toLowerCase()
                : words[0].toLowerCase();

            return (
              <li className="nav_list" key={section}>
                <NavLink
                  to={`/${linkPath}`}
                  className="nav-link"
                  onClick={closeSidebar}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </NavLink>
                <div className="circle"></div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="nav-button">
        <div className="mode">
          <div
            className="moon-sun"
            id="toggle-switch"
            onClick={() => setDarkMode(!darkMode)}
          >
            <FontAwesomeIcon icon={faMoon} id="moon" />
            <FontAwesomeIcon icon={faSun} id="sun" />
          </div>
        </div>
        <div className="navbar-right">
          {isAuthPath ? null : location.pathname === "/" ? (
            <button
              type="button"
              className="btn-signin"
              onClick={handleSignInClick}
            >
              Sign In
            </button>
          ) : (
            <>
              <img
                src={Avatar}
                alt="Profile Avatar"
                width="30"
                height="30"
                className="avatar-icon"
                onClick={handleAvatarClick}
              />
              {showDropdown && (
                <div className="dropdown-menu">
                  <button onClick={handleProfileClick} className="dropdown-item">
                    Profile
                  </button>
                  <button onClick={handleDashboardClick} className="dropdown-item">
                    Dashboard
                  </button>
                  <button onClick={handleLogoutClick} className="dropdown-item">
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="menu-icon" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={sidebarActive ? faTimes : faBars} />
      </div>
    </nav>
  );
}

export default Navbar;

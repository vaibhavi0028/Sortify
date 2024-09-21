import React from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ handleLogout }) => {
  const navigate = useNavigate();

  // Logout function
  const handleLogoutClick = () => {
    handleLogout();
    navigate('/AdminLogin'); // Redirect to login page
  };

  return (
    <div className="container">
        <div className='navbar'>
          <img src={assets.logo} alt="Logo" className='logo' />

          <div className='profile-container'>
            {/* Profile Image */}
            <img
              src={assets.profile_image}
              alt="Profile"
              className='profile'
            />

            {/* Logout button next to profile */}
            <button onClick={handleLogoutClick} className='logout-button'>
              Logout
            </button>
          </div>
    </div>
    </div>
  );
};

export default Navbar;

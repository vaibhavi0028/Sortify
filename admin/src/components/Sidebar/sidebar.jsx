import React from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const userRole = localStorage.getItem('role'); // admin or subadmin

  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/services/list' className="sidebar-option">
          <img src={assets.add_icon} alt="Add items" />
          <p>Approval list</p>
        </NavLink>

        <NavLink to='/subadmin/list' className="sidebar-option">
          <img src={assets.order_icon} alt="Papers List" />
          <p>subadmin List</p>
        </NavLink>
        <NavLink to='/services/onprocess' className="sidebar-option">
          <img src={assets.add_icon} alt="In-Progress Services" />
          <p>In-Progress Services</p>
        </NavLink>

        {/* Hide these options only for subadmin */}
        {userRole !== 'subadmin' && (
          <>
            <NavLink to='/subadmin/add' className="sidebar-option">
              <img src={assets.add_icon} alt="Create SubAdmin" />
              <p>Create SubAdmin</p>
            </NavLink>
          </>
        )}        
      </div>
    </div>
  );
};

export default Sidebar;

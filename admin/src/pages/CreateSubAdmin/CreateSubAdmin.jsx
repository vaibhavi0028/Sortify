import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './CreateSubadmin.css';

const CreateSubAdmin= () => {
  const [subAdminData, setSubAdminData] = useState({
    name: "",
    employeeId: "",
    username: "",
    password: "",
    hostelType: "",
    hostel: "",
    phoneNumber: "",
    gmail: ""
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubAdminChange = (e) => {
    const { name, value } = e.target;
    setSubAdminData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const onSubmitSubAdminHandler = async (event) => {
    event.preventDefault();

    // Validate Gmail address ends with @gmail.com
    if (!subAdminData.gmail.endsWith('@gmail.com')) {
      toast.error('Please enter a valid Gmail address');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/subadmins/add', subAdminData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setSuccessMessage('Sub-admin added successfully!');
      setSubAdminData({
        name: "",
        employeeId: "",
        username: "",
        password: "",
        hostelType: "",
        hostel: "",
        phoneNumber: "",
        gmail: ""
      });
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      toast.error('Failed to add sub-admin');
    }
  };

  return (
    <div className='add'>
      <h1 className='headers'>Add Sub-Admin</h1>
      <form className='flex-col' onSubmit={onSubmitSubAdminHandler}>
        <div className='flex-col'>
          {/* Name */}
          <div className="add-subadmin-name flex-col">
            <p>Name</p>
            <input
              type="text"
              name='name'
              value={subAdminData.name}
              onChange={handleSubAdminChange}
              placeholder='Type sub-admin name'
              required
            />
          </div>

          {/* Employee ID */}
          <div className='add-subadmin-employeeId flex-col'>
            <p>Employee ID</p>
            <input
              type="text"
              name='employeeId'
              value={subAdminData.employeeId}
              onChange={handleSubAdminChange}
              placeholder='Type employee ID'
              required
            />
          </div>

          {/* Username */}
          <div className="add-subadmin-username flex-col">
            <p>Username</p>
            <input
              type="text"
              name='username'
              value={subAdminData.username}
              onChange={handleSubAdminChange}
              placeholder='Type username'
              required
            />
          </div>

          {/* Password */}
          <div className="add-subadmin-password flex-col">
            <p>Password</p>
            <input
              type="password"
              name='password'
              value={subAdminData.password}
              onChange={handleSubAdminChange}
              placeholder='Type password'
              required
            />
          </div>

          {/* Hostel Type */}
          <div className="add-subadmin-hostelType flex-col">
            <p>Hostel Type</p>
            <input
              type="text"
              name='hostelType'
              value={subAdminData.hostelType}
              onChange={handleSubAdminChange}
              placeholder='Type hostel type'
              required
            />
          </div>

          {/* Hostel */}
          <div className="add-subadmin-hostel flex-col">
            <p>Hostel</p>
            <input
              type="text"
              name='hostel'
              value={subAdminData.hostel}
              onChange={handleSubAdminChange}
              placeholder='Type hostel name'
              required
            />
          </div>

          {/* Phone Number */}
          <div className="add-subadmin-phoneNumber flex-col">
            <p>Phone Number</p>
            <input
              type="text"
              name='phoneNumber'
              value={subAdminData.phoneNumber}
              onChange={handleSubAdminChange}
              placeholder='Type phone number'
              required
            />
          </div>

          {/* Gmail */}
          <div className="add-subadmin-gmail flex-col">
            <p>Gmail</p>
            <input
              type="email"
              name='gmail'
              value={subAdminData.gmail}
              onChange={handleSubAdminChange}
              placeholder='Type Gmail address'
              required
            />
          </div>
        </div>
        <button type='submit' className='add-button'>Add Sub-Admin</button>
      </form>
      
      {successMessage && (
        <p className='success-message'>{successMessage}</p>
      )}
    </div>
  );
};

export default CreateSubAdmin;

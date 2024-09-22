import React, { useState } from 'react';
import '../styles/Services.css';

const Services = () => {
  const [formData, setFormData] = useState({
    regNo: '',
    name: '',
    phoneNumber: '',
    roomNumber: '',
    hostelType: '',
    block: '',
    scheduleFrom: '',
    scheduleTo: '',
    serviceType: '',
    status: 'pending',
    description: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/services/raise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit service request');
      }

      const result = await response.json();
      setMessage('Service request submitted successfully!');
      setFormData({
        regNo: '',
        name: '',
        phoneNumber: '',
        roomNumber: '',
        hostelType: '',
        block: '',
        scheduleFrom: '',
        scheduleTo: '',
        serviceType: '',
        status: 'pending',
        description: ''
      });
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="services-container">
      <h1 className="servicesh1">Request Services</h1>
      {message && <div className="alert">{message}</div>}
      <form onSubmit={handleSubmit} className="services-form">
        <div className="form-group">
          <label htmlFor="regNo">Registration No:</label>
          <input
            type="text"
            id="regNo"
            name="regNo"
            className="form-control"
            value={formData.regNo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            className="form-control"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
          />
        </div>

        <div className="form-group">
          <label htmlFor="roomNumber">Room Number:</label>
          <input
            type="text"
            id="roomNumber"
            name="roomNumber"
            className="form-control"
            value={formData.roomNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="hostelType">Hostel Type:</label>
          <select
            id="hostelType"
            name="hostelType"
            className="form-select"
            value={formData.hostelType}
            onChange={handleChange}
            required
          >
            <option value="">Select hostel type</option>
            <option value="mens">Men</option>
            <option value="womens">Women</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="block">Block:</label>
          <input
            type="text"
            id="block"
            name="block"
            className="form-control"
            value={formData.block}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group schedule-group">
          <label>Schedule (Date & Time Range):</label>
          <div className="schedule-inputs">
            <div className="schedule-input1">
              <label htmlFor="scheduleFrom">From:</label>
              <input
                type="datetime-local"
                id="scheduleFrom"
                name="scheduleFrom"
                className="form-control"
                value={formData.scheduleFrom}
                onChange={handleChange}
                required
              />
            </div>
            <div className="schedule-input2">
              <label htmlFor="scheduleTo">To:</label>
              <input
                type="datetime-local"
                id="scheduleTo"
                name="scheduleTo"
                className="form-control"
                value={formData.scheduleTo}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="serviceType">Service Type:</label>
          <select
            id="serviceType"
            name="serviceType"
            className="form-select"
            value={formData.serviceType}
            onChange={handleChange}
            required
          >
            <option value="">Select a service</option>
            <option value="cleaning">Room Cleaning</option>
            <option value="electricity">Electricity Complaint</option>
            <option value="pestControl">Pest Control</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Complaints/Description:</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe any complaints or issues"
          />
        </div>

        <div className="form-group form-group-btn">
          <button type="submit" className="btn">Submit Request</button>
        </div>
      </form>
    </div>
  );
};

export default Services;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './SubAdminList.css';

const SubAdminList = () => {
  const [subAdmins, setSubAdmins] = useState([]);

  const fetchSubAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/subadmins/list');
      setSubAdmins(response.data);
    } catch (error) {
      toast.error('Error retrieving subadmin list');
    }
  };

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  return (
    <div className="subadmin-list">
      <h2>Sub-Admin List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Employee ID</th>
            <th>Username</th>
            <th>Hostel Type</th>
            <th>Hostel</th>
            <th>Phone Number</th>
            <th>Gmail</th>
          </tr>
        </thead>
        <tbody>
          {subAdmins.map((subAdmin) => (
            <tr key={subAdmin._id}>
              <td>{subAdmin.name}</td>
              <td>{subAdmin.employeeId}</td>
              <td>{subAdmin.username}</td>
              <td>{subAdmin.hostelType}</td>
              <td>{subAdmin.hostel}</td>
              <td>{subAdmin.phoneNumber}</td>
              <td>{subAdmin.gmail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubAdminList;

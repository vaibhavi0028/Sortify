import React, { useEffect, useState } from 'react';
import './ApprovalList.css'; // Ensure to import your CSS file
import { toast } from 'react-toastify'; // Import react-toastify for toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS

const ApprovalList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Track errors

  // Fetch services data from API
  const fetchServices = async () => {
    setLoading(true);
    setError(null); // Reset any previous error
    try {
      const response = await fetch('http://localhost:5000/api/services/list');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setServices(result.data);
      } else {
        console.error('Fetched data is not valid:', result);
        setError('Fetched data is not valid');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Error fetching services');
    } finally {
      setLoading(false);
    }
  };

  // Approve a specific service and send it to the onprocess/add endpoint
  const approveService = async (service) => {
    try {
      // Ensure required fields are present
      if (!service.requestId || !service.roomNumber || !service.regNo) {
        toast.error('Missing required service details');
        return;
      }

      // Auto-fill servicePhoneNumber, serviceId, and set status as 'pending'
      const serviceData = {
        requestId: service.requestId,
        roomNumber: service.roomNumber,
        regNo: service.regNo,
        phoneNumber: service.phoneNumber,
        servicePhoneNumber: '123456789', // default value
        serviceId: '1234', // default value
        status: 'pending', // Set as pending initially
        comment: '', // or other default comment
      };

      const response = await fetch('http://localhost:5000/api/onprocess/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        throw new Error('Failed to add to OnProcess');
      }

      const result = await response.json();
      console.log('Added to OnProcess:', result);

      // Update the service status locally after approval
      setServices((prevServices) =>
        prevServices.map((s) =>
          s._id === service._id ? { ...s, status: 'approved' } : s
        )
      );

      // Show toast notification for successful approval
      toast.success(`Service ${service.requestId} approved and added to OnProcess!`);
    } catch (error) {
      console.error('Error approving service:', error);
      // Show toast notification for error
      toast.error(`Failed to approve service ${service.requestId}`);
    }
  };

  // Fetch services when the component loads
  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  return (
    <div>
      <h1 className="headers">Approval List</h1>
      {services.length > 0 ? (
        <div className="list-table">
          <div className="list-table-format title">
            <div>Request ID</div>
            <div>Name</div>
            <div>Registration No</div>
            <div>Phone Number</div>
            <div>Room Number</div>
            <div>Hostel Type</div>
            <div>Block</div>
            <div>Schedule From</div>
            <div>Schedule To</div>
            <div>Status</div>
            <div>Action</div>
          </div>
          {services.map((service) => (
            <div
              key={service._id}
              className={`list-table-format ${service.status === 'approved' ? 'approved' : ''}`}
            >
              <div>{service.requestId}</div>
              <div>{service.name || 'N/A'}</div> {/* Ensure to handle missing data */}
              <div>{service.regNo}</div>
              <div>{service.phoneNumber}</div>
              <div>{service.roomNumber}</div>
              <div>{service.hostelType || 'N/A'}</div>
              <div>{service.block || 'N/A'}</div>
              <div>{new Date(service.scheduleFrom).toLocaleString()}</div>
              <div>{new Date(service.scheduleTo).toLocaleString()}</div>
              <div className="status">{service.status}</div>
              <div>
                {service.status !== 'approved' ? (
                  <button onClick={() => approveService(service)}>Approve</button>
                ) : (
                  <button disabled>Approved</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No services available</p>
      )}
    </div>
  );
};

export default ApprovalList;

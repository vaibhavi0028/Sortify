import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './OnProcessList.css';

const OnProcessList = () => {
  const [onProcesses, setOnProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the server
  const fetchOnProcesses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/onprocess/list');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setOnProcesses(result.data);
      } else {
        console.error('Invalid data format:', result);
        setError('Invalid data format');
      }
    } catch (error) {
      console.error('Error fetching on processes:', error);
      setError('Error fetching on processes');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete action
  const handleDelete = async (requestId) => {
    try {
      const response = await fetch('http://localhost:5000/api/onprocess/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete process');
      }

      const result = await response.json();
      if (result.message === 'OnProcess deleted successfully') {
        setOnProcesses((prev) => prev.filter((process) => process.requestId !== requestId));
        toast.success('Process deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting process:', error);
      toast.error('Error deleting process');
    }
  };

  useEffect(() => {
    fetchOnProcesses();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="on-process-list">
      <ToastContainer />
      <h1 className="headers">On Process List</h1>
      {onProcesses.length > 0 ? (
        <table className="process-table">
          <thead>
            <tr className="list-table-format title">
              <th>Request ID</th>
              <th>Room Number</th>
              <th>Registration No</th>
              <th>Phone Number</th>
              <th>Service Phone Number</th>
              <th>Service ID</th>
              <th>Status</th>
              <th>On Process</th>
              <th>Completed</th>
              <th>Comment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {onProcesses.map((process) => (
              <tr key={process._id} className={`list-table-format table-row ${process.completed ? 'completed' : ''}`}>
                <td>{process.requestId}</td>
                <td>{process.roomNumber}</td>
                <td>{process.regNo}</td>
                <td>{process.phoneNumber}</td>
                <td>{process.servicePhoneNumber}</td>
                <td>{process.serviceId}</td>
                <td>{process.status}</td>
                <td>{process.onProcess ? 'Yes' : 'No'}</td>
                <td>{process.completed ? 'Yes' : 'No'}</td>
                <td>{process.comment || 'N/A'}</td>
                <td>
                  <button onClick={() => handleDelete(process.requestId)} className="approve-button">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No processes available</p>
      )}
    </div>
  );
};

export default OnProcessList;

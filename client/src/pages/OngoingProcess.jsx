import React, { useEffect, useState } from 'react';
// import '../styles/OngoingProcess.css';

const OngoingProcess = () => {
  const [ongoingProcesses, setOngoingProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');

  const fetchOngoingProcesses = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/onprocess/list');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log(result);

      // Access the data array inside result
      if (result.success && Array.isArray(result.data)) {
        setOngoingProcesses(result.data); // Updated to use result.data
      } else {
        console.error('Fetched data is not valid:', result);
      }
    } catch (error) {
      console.error('Error fetching ongoing processes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (processId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/onprocess/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: processId,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete the process');
      }

      const result = await response.json();
      if (result.message.includes('deleted')) {
        alert('Thank you for using our services! Your process has been completed and deleted.');
      }

      fetchOngoingProcesses();
      setComment('');
    } catch (error) {
      console.error('Error completing the process:', error);
    }
  };

  useEffect(() => {
    fetchOngoingProcesses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-center mt-5">Ongoing Processes</h2>
      <p className="text-center">Here you can track your ongoing service requests.</p>
      {ongoingProcesses.length > 0 ? (
        <div className="ongoing-process-list">
          {ongoingProcesses.map((process) => (
            <div key={process._id} className="process-item">
              <h3>Request ID: {process.requestId}</h3>
              <p><strong>Room Number:</strong> {process.roomNumber}</p>
              <p><strong>Registration No:</strong> {process.regNo}</p>
              <p><strong>Phone Number:</strong> {process.phoneNumber}</p>
              <p><strong>Status:</strong> {process.status}</p>
              <p><strong>Comment:</strong> {process.comment || 'No comments yet'}</p>
              
              {process.status === 'pending' && (
                <div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                  />
                  <button onClick={() => handleComplete(process._id)}>Complete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No ongoing processes available</p>
      )}
    </div>
  );
};

export default OngoingProcess;

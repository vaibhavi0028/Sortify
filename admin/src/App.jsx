import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateSubAdmin from './pages/CreateSubAdmin/CreateSubAdmin';
import SubAdminList from './pages/SubAdminList/SubAdminList';
import ApprovalList from './pages/ApprovalList/ApprovalList';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import OnProcessList from './pages/OnProcessList/OnProcessList'; // Import OnProcessList

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate('/AdminLogin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    setIsAuthenticated(false);
    navigate('/AdminLogin'); // Redirect to login page
  };

  return (
    <div>
      <ToastContainer />
      {isAuthenticated && <Navbar handleLogout={handleLogout} />}
      <hr />
      <div className="app-content">
        {isAuthenticated && <Sidebar />}
        <Routes>
          <Route
            path='/AdminLogin'
            element={
              isAuthenticated ? <Navigate to='/services/list' /> : <AdminLogin setIsAuthenticated={setIsAuthenticated} />
            }
          />
          {/* Protected Routes */}
          {isAuthenticated ? (
            <>
              <Route path='/subadmin/add' element={<CreateSubAdmin />} />
              <Route path='/subadmin/list' element={<SubAdminList />} />
              <Route path='/services/list' element={<ApprovalList />} />
              <Route path='/services/onprocess' element={<OnProcessList />} /> {/* Use OnProcessList */}
            </>
          ) : (
            <Route path="*" element={<Navigate to="/AdminLogin" />} />
          )}
        </Routes>
      </div>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

// admin login pages api integration
const AdminLogin = ({ setIsAuthenticated, setUserRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const apiUrl = role === 'admin'
        ? 'http://localhost:5000/api/admin/list'
        : 'http://localhost:5000/api/subadmins/list';
  
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('API Response:', data);
  
      // Directly check the returned array for the matching user
      const user = data.find(user => user.username === username && user.password === password);
  
      if (user) {
        localStorage.setItem('token', 'authenticated');
        localStorage.setItem('role', role);
  
        setIsAuthenticated(true);
        setUserRole(role);
  
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while logging in');
    }
  };
  
// admin login pages api integration end
  return (
    <div className="login-container" >
      <div className="login-box">
        <div className="row">
          <div className="col-lg-9">

            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className='role'>
                <label >Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="admin">Admin</option>
                  <option value="subadmin">Subadmin</option>
                </select>
              </div>
              <button type="submit" className="login-button" >Login</button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;

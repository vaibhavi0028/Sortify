import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Example auth check

  return (
    <Route
      {...rest}
      element={isAuthenticated ? Component : <Navigate to="/AdminLogin" />}
    />
  );
};

export default PrivateRoute;

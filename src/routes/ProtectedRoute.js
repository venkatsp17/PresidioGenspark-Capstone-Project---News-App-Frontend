import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/auth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can add a loading spinner or some loading UI here if you prefer
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

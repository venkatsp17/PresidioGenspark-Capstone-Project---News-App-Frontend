import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/auth';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can add a loading spinner or some loading UI here if you prefer
    return <div>Loading...</div>;
  }
  return user && user.role === 1 ? children : <Navigate to="/login" />;
};

export default AdminRoute;
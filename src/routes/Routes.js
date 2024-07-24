import React from 'react';
import { BrowserRouter as Router, Route, Routes as RouterRoutes } from 'react-router-dom';
import Login from '../pages/Login';
import HomePage from '../pages/Home';
import ProtectedRoute from '../routes/ProtectedRoute';
import { AuthProvider } from '../services/auth';

const AppRoutes = () => (
  <AuthProvider>
    <Router>
      <RouterRoutes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      </RouterRoutes>
    </Router>
  </AuthProvider>
);

export default AppRoutes;

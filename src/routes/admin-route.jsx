import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../services/auth.js";

const AdminRoute = ({ children }) => {
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (user) {
      const token = user.token;
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          // Token has expired
          logout();
        }
      } catch (error) {
        // Error decoding token, possibly invalid token
        logout();
      }
    }
  }, [user, logout]);

  if (loading) {
    // You can add a loading spinner or some loading UI here if you prefer
    return (
      <div class="d-flex justify-content-center align-items-center h-100">
        <div class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-muted">Please wait, loading data...</p>
        </div>
      </div>
    );
  }

  return user && user.role === 1 ? children : <Navigate to="/login" />;
};

export default AdminRoute;

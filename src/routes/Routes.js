import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes as RouterRoutes,
} from "react-router-dom";
import HomePage from "../pages/Home";
import ProtectedRoute from "../routes/ProtectedRoute";
import { AuthProvider } from "../services/auth";
import AdminRoute from "./AdminRoute";
import AdminHome from "../pages/admin/AdminHome";
import TabSwitcher from "../pages/TabSwitcher";

const AppRoutes = () => (
  <AuthProvider>
    <Router>
      <RouterRoutes>
        <Route path="/login" element={<TabSwitcher />} />
        <Route path="/" element={<HomePage />} />
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminHome />
            </AdminRoute>
          }
        />
      </RouterRoutes>
    </Router>
  </AuthProvider>
);

export default AppRoutes;

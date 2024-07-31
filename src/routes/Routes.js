import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes as RouterRoutes,
} from "react-router-dom";
import HomePage from "../pages/User/Home";
import ProtectedRoute from "../routes/ProtectedRoute";
import { AuthProvider } from "../services/auth";
import AdminRoute from "./AdminRoute";
import AdminHome from "../pages/Admin/AdminHome";
import TabSwitcher from "../pages/TabSwitcher";
import { SavedArticlesProvider } from "../services/SaveArticleContext";

const AppRoutes = () => (
  <AuthProvider>
    <Router>
      <RouterRoutes>
        <Route path="/login" element={<TabSwitcher />} />

        <Route
          path="/"
          element={
            <SavedArticlesProvider>
              <HomePage />
            </SavedArticlesProvider>
          }
        />

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

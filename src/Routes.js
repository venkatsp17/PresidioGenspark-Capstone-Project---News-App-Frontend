import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/user/home.jsx";
import { AuthProvider } from "./services/auth.js";
import AdminRoute from "./routes/adminroute.jsx";
import TabSwitcher from "./pages/tabswitcher.jsx";
import { SavedArticlesProvider } from "./services/savearticlecontext.jsx";
import AdminHome from "./pages/admin/admin-home.jsx";

const AppRoutes = () => (
  <AuthProvider>
    <Router>
      <Routes>
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
      </Routes>
    </Router>
  </AuthProvider>
);

export default AppRoutes;

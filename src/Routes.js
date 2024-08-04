import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/User/Home.jsx";
import { AuthProvider } from "./services/auth.js";
import AdminRoute from "./routes/admin-route.jsx";
import AdminHome from "./pages/admin/admin-home.jsx";
import TabSwitcher from "./pages/TabSwitcher.jsx";
import { SavedArticlesProvider } from "./services/SaveArticleContext.jsx";

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
          element={<AdminRoute>{<AdminHome />}</AdminRoute>}
        />
      </Routes>
    </Router>
  </AuthProvider>
);

export default AppRoutes;

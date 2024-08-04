import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes, // Use `Routes` here
} from "react-router-dom";
import HomePage from "./pages/User/Home.jsx";
import { AuthProvider } from "./services/auth.js";
import AdminRoute from "./routes/AdminRoute.js";
import AdminHome from "./pages/Admin/AdminHome.jsx";
import TabSwitcher from "./pages/TabSwitcher.jsx";
import { SavedArticlesProvider } from "./services/SaveArticleContext.jsx";

const AppRoutes = () => (
  <AuthProvider>
    <Router>
      <Routes>
        {" "}
        {/* Use `Routes` here */}
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

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/user/home.jsx";
import { AuthProvider } from "./services/auth.js";
import AdminRoute from "./routes/adminroute.jsx";
import TabSwitcher from "./pages/tabswitcher.jsx";
import { SavedArticlesProvider } from "./services/savearticlecontext.jsx";
import AdminHome from "./pages/admin/admin-home.jsx";
import { ThemeProvider } from "./services/themecontext.jsx";

const AppRoutes = () => (
  <AuthProvider>
    <ThemeProvider>
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
    </ThemeProvider>
  </AuthProvider>
);

export default AppRoutes;

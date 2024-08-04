import { useState, useEffect } from "react";
import Sidebar from "../../components/admin/sidebar.jsx";
import Header from "../../components/admin/header.jsx";
import { Routes, Route, useLocation } from "react-router-dom";
import ProfileModal from "../../components/profilemodal.jsx";
import AdminCategories from "./admin-categories.jsx";
import AdminArticles from "./admin-articles.jsx";
import AdminDashboard from "./admin-dashboard.jsx";
import { useTheme } from "../../services/themecontext.jsx";
import "../../styles/admin/admin.css";

const AdminHome = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();

  const [showProfileModalAdmin, setshowProfileModalAdmin] = useState(false);

  const handleshowProfileModalAdmin = () => setshowProfileModalAdmin(true);

  const handlecloseProfileModalAdmin = () => setshowProfileModalAdmin(false);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when the route changes
  }, [location]);

  const { bgtheme, texttheme } = useTheme();

  return (
    <div className="d-flex vh-100">
      <Sidebar />
      <div className="h-100 flex-grow-1 d-flex flex-column">
        <Header handleshowProfileModalAdmin={handleshowProfileModalAdmin} />
        <div
          className={`h-100 container-fluid bg-${bgtheme} text-${texttheme} overflow-auto`}
        >
          <Routes>
            <Route path="" element={<AdminDashboard />} />
            <Route
              path="articles"
              element={
                <AdminArticles
                  status={"0"}
                  currentPage1={currentPage}
                  setCurrentPage1={setCurrentPage}
                />
              }
            />
            <Route
              path="articles/edited"
              element={
                <AdminArticles
                  status={"1"}
                  currentPage1={currentPage}
                  setCurrentPage1={setCurrentPage}
                />
              }
            />
            <Route
              path="articles/approved"
              element={
                <AdminArticles
                  status={"2"}
                  currentPage1={currentPage}
                  setCurrentPage1={setCurrentPage}
                />
              }
            />
            <Route
              path="articles/rejected"
              element={
                <AdminArticles
                  status={"3"}
                  currentPage1={currentPage}
                  setCurrentPage1={setCurrentPage}
                />
              }
            />
            <Route path="categories" element={<AdminCategories />} />
          </Routes>
        </div>
      </div>
      <ProfileModal
        show={showProfileModalAdmin}
        handleClose={handlecloseProfileModalAdmin}
      />
    </div>
  );
};

export default AdminHome;

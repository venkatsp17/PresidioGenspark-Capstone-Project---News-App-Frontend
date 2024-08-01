import { React, useState, useEffect } from "react";
import Sidebar from "../../components/Admin/Sidebar";
import Header from "../../components/Admin/Header";
import { Route, Routes as RouterRoutes, useLocation } from "react-router-dom";
import AdminArticles from "./AdminArticles";
import AdminDashboard from "./AdminDashboard";
import ProfileModal from "../../components/ProfileModal";
import AdminCategories from "./AdminCategories";
import { useTheme } from "../../services/ThemeContext";

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
          <RouterRoutes>
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
          </RouterRoutes>
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

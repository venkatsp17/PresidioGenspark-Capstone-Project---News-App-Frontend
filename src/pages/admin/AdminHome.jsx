import { React, useState, useEffect } from "react";
import Sidebar from "../../components/Admin/Sidebar";
import Header from "../../components/Admin/Header";
import { Route, Routes as RouterRoutes, useLocation } from "react-router-dom";
import AdminArticles from "./AdminArticles";
import AdminDashboard from "./AdminDashboard";

const AdminHome = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when the route changes
  }, [location]);
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <div className="container-fluid">
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
          </RouterRoutes>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

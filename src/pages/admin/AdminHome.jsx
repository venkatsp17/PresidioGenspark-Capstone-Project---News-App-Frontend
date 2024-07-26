import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { Route, Routes as RouterRoutes } from "react-router-dom";
import AdminArticles from "./AdminArticles";
import AdminDashboard from "./AdminDashboard";

const AdminHome = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <div className="container-fluid">
          <RouterRoutes>
            <Route path="" element={<AdminDashboard />} />
            <Route path="articles" element={<AdminArticles status={"0"} />} />
            <Route
              path="articles/edited"
              element={<AdminArticles status={"1"} />}
            />
            <Route
              path="articles/approved"
              element={<AdminArticles status={"2"} />}
            />
            <Route
              path="articles/rejected"
              element={<AdminArticles status={"3"} />}
            />
          </RouterRoutes>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

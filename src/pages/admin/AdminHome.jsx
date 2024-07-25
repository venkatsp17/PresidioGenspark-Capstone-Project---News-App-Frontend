import React from 'react'
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Route, Routes as RouterRoutes } from 'react-router-dom';
import AdminArticles from './AdminArticles';
import AdminDashboard from './AdminDashboard';
import "../../styles/admin/AdminHome.css"

const AdminHome = () => {
  return (
    <div className="admin-container">
    <Sidebar />
    <div className="main-content">
      <Header />
      <RouterRoutes>
      <Route path="" element={<AdminDashboard />} />
        <Route path="articles" element={<AdminArticles />} />
      </RouterRoutes>
    </div>
  </div>
  )
}

export default AdminHome
import React from 'react'
import "../styles/components/Header.css";

const Header = () => {
  return (
    <header className="header">
    <h1>Admin Dashboard</h1>
    <div className="header-controls">
      <button>Profile</button>
      <button>Logout</button>
    </div>
  </header>
  )
}

export default Header
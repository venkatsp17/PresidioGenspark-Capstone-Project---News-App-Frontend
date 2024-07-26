import React from "react";
// import "../styles/components/Header.css";

const Header = () => {
  return (
    <header className="header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
      <h1 className="mb-0 animate__animated animate__fadeIn">
        Admin Dashboard
      </h1>
      <div className="d-flex">
        <button className="btn btn-outline-light me-2 animate__animated animate__fadeIn">
          Profile
        </button>
        <button className="btn btn-outline-light animate__animated animate__fadeIn">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "../../styles/components/Header.css";
import { useAuth } from "../../services/auth.js";

const Header = ({ handleshowProfileModalAdmin }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { logout } = useAuth();

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
      <h1 className="mb-0 animate__animated animate__fadeIn">
        Admin Dashboard
      </h1>
      <div className="d-flex align-items-center">
        <div className="position-relative" ref={dropdownRef}>
          <button
            className="btn btn-outline-light animate__animated animate__fadeIn"
            onClick={toggleDropdown}
          >
            <FontAwesomeIcon icon={faUser} />
          </button>
          {showDropdown && (
            <div className="dropdown-menu dropdown-menu-end show dropdown-animation">
              <button
                className="dropdown-item"
                onClick={handleshowProfileModalAdmin}
              >
                Profile
              </button>
              <button className="dropdown-item" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

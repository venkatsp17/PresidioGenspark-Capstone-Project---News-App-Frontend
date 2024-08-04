import React, { useState } from "react";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

const TabSwitcher = () => {
  const [activeTab, setActiveTab] = useState("login");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleRegistrationSuccess = () => {
    setActiveTab("login");
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
      <div className="row justify-content-center w-100">
        <div className="col-md-6 col-lg-4">
          <ul
            className="nav nav-pills nav-justified mb-3"
            id="ex1"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <a
                className={`nav-link ${activeTab === "login" ? "active" : ""}`}
                id="tab-login"
                href="#pills-login"
                role="tab"
                aria-controls="pills-login"
                aria-selected={activeTab === "login"}
                onClick={() => handleTabChange("login")}
              >
                Login
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a
                className={`nav-link ${
                  activeTab === "register" ? "active" : ""
                }`}
                id="tab-register"
                href="#pills-register"
                role="tab"
                aria-controls="pills-register"
                aria-selected={activeTab === "register"}
                onClick={() => handleTabChange("register")}
              >
                Register
              </a>
            </li>
          </ul>
          <div className="tab-content">
            {activeTab === "login" && <Login />}
            {activeTab === "register" && (
              <Register onRegistrationSuccess={handleRegistrationSuccess} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabSwitcher;

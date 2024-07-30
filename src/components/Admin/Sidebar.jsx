import { React, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faNewspaper,
  faCog,
  faChartBar,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/components/Sidebar.css";

const Sidebar = () => {
  const [isArticlesOpen, setIsArticlesOpen] = useState(false);

  return (
    <nav className="sidebar">
      <ul className="nav flex-column">
        <li className="nav-item mt-5">
          <Link to="/admin/" className="nav-link nav-linkcolour">
            <FontAwesomeIcon icon={faTachometerAlt} className="icon" />
            <span className="text">Dashboard</span>
          </Link>
        </li>
        <li className="nav-item mt-2">
          <a
            href="#!"
            className={`nav-linkcolour nav-link ${
              isArticlesOpen ? "active" : ""
            }`}
            onMouseEnter={() => setIsArticlesOpen(true)}
            onMouseLeave={() => setIsArticlesOpen(false)}
          >
            <FontAwesomeIcon icon={faNewspaper} className="icon" />
            <span className="text">Articles</span>
          </a>
          <ul
            className={`submenu ${isArticlesOpen ? "show" : ""}`}
            onMouseEnter={() => setIsArticlesOpen(true)}
            onMouseLeave={() => setIsArticlesOpen(false)}
          >
            <li>
              <Link to="/admin/articles" className="submenu-item">
                Pending
              </Link>
            </li>
            <li>
              <Link to="/admin/articles/edited" className="submenu-item">
                Edited
              </Link>
            </li>
            <li>
              <Link to="/admin/articles/approved" className="submenu-item">
                Approved
              </Link>
            </li>
            <li>
              <Link to="/admin/articles/rejected" className="submenu-item">
                Rejected
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-item mt-2">
          <Link to="/admin/settings" className="nav-link nav-linkcolour">
            <FontAwesomeIcon icon={faCog} className="icon" />
            <span className="text">Settings</span>
          </Link>
        </li>
        <li className="nav-item mt-2">
          <Link to="/admin/analytics" className="nav-link nav-linkcolour">
            <FontAwesomeIcon icon={faChartBar} className="icon" />
            <span className="text">Analytics</span>
          </Link>
        </li>
        <li className="nav-item mt-2">
          <Link to="/admin/reports" className="nav-link nav-linkcolour">
            <FontAwesomeIcon icon={faFileAlt} className="icon" />
            <span className="text">Reports</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;

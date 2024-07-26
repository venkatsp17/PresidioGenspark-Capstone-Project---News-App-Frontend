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

const Sidebar = () => {
  const [isArticlesOpen, setIsArticlesOpen] = useState(false);

  return (
    <nav className="d-flex flex-column bg-dark text-white p-3 vh-100">
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/admin/" className="nav-link text-white">
            <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <a
            href="#!"
            className={`nav-link text-white ${isArticlesOpen ? "active" : ""}`}
            onClick={() => setIsArticlesOpen(!isArticlesOpen)}
          >
            <FontAwesomeIcon icon={faNewspaper} className="me-2" />
            Articles
          </a>
          {isArticlesOpen && (
            <ul className="list-unstyled ps-3">
              <li>
                <Link
                  to="/admin/articles"
                  className="text-white text-decoration-none"
                >
                  Pending Articles
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/articles/edited"
                  className="text-white text-decoration-none"
                >
                  Edited Articles
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/articles/approved"
                  className="text-white text-decoration-none"
                >
                  Approved Articles
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/articles/rejected"
                  className="text-white text-decoration-none"
                >
                  Rejected Articles
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="nav-item">
          <Link to="/admin/settings" className="nav-link text-white">
            <FontAwesomeIcon icon={faCog} className="me-2" />
            Settings
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/analytics" className="nav-link text-white">
            <FontAwesomeIcon icon={faChartBar} className="me-2" />
            Analytics
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/reports" className="nav-link text-white">
            <FontAwesomeIcon icon={faFileAlt} className="me-2" />
            Reports
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;

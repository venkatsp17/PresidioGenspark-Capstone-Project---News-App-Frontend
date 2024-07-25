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
import "../styles/components/Sidebar.css";

const Sidebar = () => {
  const [isArticlesOpen, setIsArticlesOpen] = useState(false);

  return (
    <aside className="sidebar">
      <ul>
        <li></li>
        <li>
          <Link to="/admin/">
            <FontAwesomeIcon icon={faTachometerAlt} className="icon" />
            <span className="link-text">Dashboard</span>
          </Link>
        </li>
        <li
          onMouseEnter={() => setIsArticlesOpen(true)}
          onMouseLeave={() => setIsArticlesOpen(false)}
        >
          <Link to="/admin/articles">
            <FontAwesomeIcon icon={faNewspaper} className="icon" />
            <span className="link-text">Articles</span>
          </Link>
        </li>
        {isArticlesOpen && (
          <ul className="submenu" onMouseEnter={() => setIsArticlesOpen(true)}
          onMouseLeave={() => setIsArticlesOpen(false)}>
             <li>
              <Link to="/admin/articles">Pending Articles</Link>
            </li>
            <li>
              <Link to="/admin/articles/edited">Edited Articles</Link>
            </li>
            <li>
              <Link to="/admin/articles/approved">Approved Articles</Link>
            </li>
            <li>
              <Link to="/admin/articles/rejected">Rejected Articles</Link>
            </li>
           
          </ul>
        )}
        <li>
          <Link to="/admin/settings">
            <FontAwesomeIcon icon={faCog} className="icon" />
            <span className="link-text">Settings</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/analytics">
            <FontAwesomeIcon icon={faChartBar} className="icon" />
            <span className="link-text">Analytics</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/reports">
            <FontAwesomeIcon icon={faFileAlt} className="icon" />
            <span className="link-text">Reports</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;

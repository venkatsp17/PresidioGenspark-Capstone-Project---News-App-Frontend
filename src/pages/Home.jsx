import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Row, Button, Pagination } from "react-bootstrap";
import { FaBars, FaUser } from "react-icons/fa";
import LeftMenu from "../components/LeftMenu";
import RightMenu from "../components/RightMenu";
import CustomCard from "../components/CustomCard";
import "../styles/user/Home.css";
import { useAuth } from "../services/auth";
import { useNavigate } from "react-router-dom";
import ProfileModal from "../components/ProfileModal";

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showLeftMenu, setShowLeftMenu] = useState(false);
  const [showRightMenu, setShowRightMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const articlesPerPage = 10;
  const [selectedCategory, setSelectedCategory] = useState({
    id: 28,
    name: "Top Stories",
    description: "topstories",
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { logout, user } = useAuth();

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const fetchArticles = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://localhost:7285/api/Article/userpaginatedarticles",
        {
          params: {
            categoryID: selectedCategory.id,
            pageno: page,
            pagesize: articlesPerPage,
          },
        }
      );
      const data = response.data;
      console.log(response.data);
      setArticles(data.articles);
      setTotalPages(data.totalpages);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage, selectedCategory]);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "0px",
          left: "0px",
          width: "100%",
          zIndex: "500",
        }}
      >
        <div className="w-100 d-flex justify-content-between align-items-center bg-primary p-3">
          <Button variant="default" onClick={() => setShowLeftMenu(true)}>
            <FaBars color="black" size={30} />
          </Button>
          <h2 className="text-muted m-0">{selectedCategory.name}</h2>
          <div ref={dropdownRef}>
            <FaUser color="black" size={30} onClick={toggleDropdown} />
            {showDropdown && (
              <div className="dropdown-menu dropdown-menu-end show">
                {user ? (
                  <button onClick={handleShow} className="dropdown-item">
                    Profile
                  </button>
                ) : (
                  ""
                )}
                <button
                  className="dropdown-item"
                  onClick={() => {
                    if (user) {
                      logout();
                    } else {
                      navigate("/login");
                    }
                  }}
                >
                  {user ? "Logout" : "Login"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="vh-100 w-100 m-0 p-3 d-flex flex-column align-items-center">
        <LeftMenu
          show={showLeftMenu}
          handleClose={() => setShowLeftMenu(false)}
          setSelectedCategory={setSelectedCategory}
        />
        <RightMenu
          show={showRightMenu}
          handleClose={() => setShowRightMenu(false)}
        />
        <Row className="w-100 d-flex justify-content-center mt-5">
          {!(error || loading) ? (
            <Pagination className="mt-5">
              {[...Array(totalPages).keys()].map((number) => (
                <Pagination.Item
                  key={number}
                  active={number + 1 === currentPage}
                  onClick={() => handlePageChange(number + 1)}
                >
                  {number + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          ) : (
            <></>
          )}
        </Row>
        <Row className="w-100 d-flex flex-column align-items-center mt-2">
          {loading ? (
            <div class="d-flex justify-content-center align-items-center h-100 w-100">
              <div class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">Please wait, loading data...</p>
              </div>
            </div>
          ) : (
            <></>
          )}
          {error ? (
            <div class="container d-flex justify-content-center align-items-center h-100">
              <div class="text-center">
                <div class="fs-1 mb-3">😞</div>
                <div class="fs-4 text-muted">No Data Available</div>
              </div>
            </div>
          ) : (
            <></>
          )}
          {error || loading ? (
            <></>
          ) : (
            articles.map((articleData) => (
              <CustomCard
                key={articleData.articleID}
                articleData={articleData}
              />
            ))
          )}
        </Row>
        <Row className="w-100 d-flex justify-content-center">
          {!(error || loading) ? (
            <Pagination>
              {[...Array(totalPages).keys()].map((number) => (
                <Pagination.Item
                  key={number}
                  active={number + 1 === currentPage}
                  onClick={() => handlePageChange(number + 1)}
                >
                  {number + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          ) : (
            <></>
          )}
        </Row>
      </div>
      <ProfileModal show={show} handleClose={handleClose} />
    </>
  );
};

export default HomePage;

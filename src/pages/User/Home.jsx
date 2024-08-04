import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Row, Button, Pagination } from "react-bootstrap";
import { FaBars, FaUser } from "react-icons/fa";
import LeftMenu from "../../components/LeftMenu.jsx";
import CustomCard from "../../components/CustomCard.jsx";
import "../../styles/user/Home.css";
import { useAuth } from "../../services/auth.js";
import { useNavigate } from "react-router-dom";
import ProfileModal from "../../components/ProfileModal.jsx";
import CommentModal from "../../components/CommentModal.jsx";
import { jwtDecode } from "jwt-decode";
import BookMarksModal from "../../components/User/BookMarksModal.jsx";
import signalRService from "../../services/signalrService.js";
import ShareLinkModal from "../../components/User/ShareModal.jsx";
import "../../styles/components/customcard.css";
import { useTheme } from "../../services/ThemeContext.jsx";
import { useSavedArticles } from "../../services/SaveArticleContext.jsx";
import TabBar from "./TabBar.jsx";
import { apiUrl } from "../../utils/constants.jsx";

const HomePage = () => {
  //Use States
  const { logout, user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [top3articles, settop3Articles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showLeftMenu, setShowLeftMenu] = useState(false);
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
  const { SetSaveStatusData } = useSavedArticles();

  const articleIDsRef = useRef(new Set());
  const [show, setShow] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showbookmarks, setShowBoomarks] = useState(false);
  const [showshare, setShowshare] = useState(false);
  const [articleDataComment, setarticleDataComment] = useState(null);
  const [shareData, setshareData] = useState(null);
  const [activeTab, setActiveTab] = useState("dailynews");

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
  };
  //Use Effects
  useEffect(() => {
    if (user) {
      // console.log(user.token);
      const token = user.token;
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          logout();
        }
      } catch (error) {
        logout();
      }
    }
  }, [user, logout]);

  useEffect(() => {
    fetchArticles(currentPage, activeTab);
    // console.log(articles);
  }, [currentPage, selectedCategory, user, activeTab]);

  useEffect(() => {
    if (user) {
      signalRService.start().then(() => {
        articles.forEach((article) => {
          signalRService.joinGroup(article.articleID);
        });
      });

      const commentCountListener = (articleID, newCommentCount) => {
        settop3Articles((prevArticles) =>
          prevArticles.map((article) =>
            article.articleID.toString() === articleID.toString()
              ? { ...article, commentCount: newCommentCount }
              : article
          )
        );
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.articleID.toString() === articleID.toString()
              ? { ...article, commentCount: newCommentCount }
              : article
          )
        );
        // if (
        //   articleDataComment &&
        //   articleDataComment.articleID.toString() === articleID.toString()
        // ) {
        //   setarticleDataComment((prev) => ({
        //     ...prev,
        //     commentCount: newCommentCount,
        //   }));
        // }
      };

      const saveCountListener = (articleID, savecount) => {
        settop3Articles((prevArticles) =>
          prevArticles.map((article) =>
            article.articleID.toString() === articleID.toString()
              ? { ...article, saveCount: savecount }
              : article
          )
        );
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.articleID.toString() === articleID.toString()
              ? { ...article, saveCount: savecount }
              : article
          )
        );
        // if (
        //   articleDataComment &&
        //   articleDataComment.articleID.toString() === articleID.toString()
        // ) {
        //   console.log("in");
        //   setarticleDataComment((prev) => ({ ...prev, saveCount: savecount }));
        // }
      };

      const shareCountListener = (articleID, sharecount) => {
        settop3Articles((prevArticles) =>
          prevArticles.map((article) =>
            article.articleID.toString() === articleID.toString()
              ? { ...article, shareCount: sharecount }
              : article
          )
        );
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.articleID.toString() === articleID.toString()
              ? { ...article, shareCount: sharecount }
              : article
          )
        );
        // if (
        //   articleDataComment &&
        //   articleDataComment.articleID.toString() === articleID.toString()
        // ) {
        //   console.log("share");
        //   setarticleDataComment((prev) => ({ ...prev, shareCount: sharecount }));
        // }
      };

      signalRService.onUpdateCommentCount(commentCountListener);
      signalRService.onSaveArticleCount(saveCountListener);
      signalRService.onShareCount(shareCountListener);

      return () => {
        articles.forEach((article) => {
          signalRService.leaveGroup(article.articleID);
        });
      };
    }
  }, [articles, user]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleClose1 = () => setShowComments(false);
  const handleShow1 = () => setShowComments(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleShareModalClose = () => setShowshare(false);
  const handleShareModalShow = () => setShowshare(true);

  const handleCommentOPen = (article) => {
    setarticleDataComment(article);
    handleShow1();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const fetchArticles = async (page, fetchType) => {
    setLoading(true);
    setError(null);

    try {
      let response;

      if (fetchType === "myfeeds") {
        response = await axios.get(`${apiUrl}/Article/userfeeds`, {
          params: {
            pageno: page,
            pagesize: articlesPerPage,
            userid: user ? parseInt(user.userID) : 0,
          },
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });
      } else if (fetchType === "dailynews") {
        response = await axios.get(`${apiUrl}/Article/userpaginatedarticles`, {
          params: {
            categoryID: selectedCategory.id,
            pageno: page,
            pagesize: articlesPerPage,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        throw new Error("Invalid fetchType provided.");
      }

      const data = response.data;

      setArticles(data.articles);

      if (user) {
        const top3data = await fetchTop3Articles();
        if (Array.isArray(top3data) && Array.isArray(data.articles)) {
          const extractedArticlesData = data.articles.map((article) => ({
            articleID: article.articleID,
            isSaved: article.isSaved,
          }));
          const top3dataExtracted = top3data.map((data) => ({
            articleID: data.articleID,
            isSaved: data.isSaved,
          }));
          const combinedData = [...extractedArticlesData, ...top3dataExtracted];
          SetSaveStatusData(combinedData);
        }
      }

      setTotalPages(data.totalpages);
      if (user) {
        joinArticleGroups(data.articles);
      }
    } catch (error) {
      setError(error.message);
      // console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setActiveTab("dailynews");
  }, [logout]);

  const fetchTop3Articles = async () => {
    try {
      const response = await axios.get(`${apiUrl}/Article/rankedarticles`, {
        params: {
          categoryID: selectedCategory.id,
          userid: user ? parseInt(user.userID) : 0,
        },
        headers: {
          Authorization: `Bearer ${user ? user.token : ""}`,
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      // console.log(data);
      settop3Articles(data);
      return data;
    } catch (error) {
      // console.error("Error fetching articles:", error);
    }
  };

  const joinArticleGroups = (articles) => {
    const newArticleIDs = new Set(articles.map((article) => article.articleID));
    const currentArticleIDs = articleIDsRef.current;

    currentArticleIDs.forEach((articleID) => {
      if (!newArticleIDs.has(articleID)) {
        signalRService.leaveGroup(articleID);
      }
    });

    newArticleIDs.forEach((articleID) => {
      if (!currentArticleIDs.has(articleID)) {
        signalRService.joinGroup(articleID);
      }
    });

    articleIDsRef.current = newArticleIDs;
  };

  const { bgtheme, texttheme } = useTheme();

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
        <div
          className={`w-100 d-flex justify-content-between align-items-center p-3 bg-${
            bgtheme === "dark" ? "dark" : "primary"
          } text-${texttheme}`}
        >
          <Button variant="default" onClick={() => setShowLeftMenu(true)}>
            <FaBars
              color={`${bgtheme === "dark" ? "white" : "black"}`}
              size={30}
            />
          </Button>
          <h2 className={`text-${texttheme} m-0`}>
            {activeTab === "myfeeds" ? "" : selectedCategory.name}
          </h2>
          <div ref={dropdownRef}>
            <FaUser
              color={`${bgtheme === "dark" ? "white" : "black"}`}
              size={30}
              onClick={toggleDropdown}
              className="user-icon-animation"
            />
            {showDropdown && (
              <div
                className={`dropdown-menu dropdown-menu-end show bg-${bgtheme} dropdown-animation`}
              >
                {user ? (
                  <button
                    onClick={handleShow}
                    className={`dropdown-item text-${texttheme}`}
                  >
                    Profile
                  </button>
                ) : (
                  ""
                )}
                <button
                  className={`dropdown-item text-${texttheme}`}
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

      <div
        className={`${
          articles.length === 0 ? "vh-100" : "h-100"
        } w-100 mt-5 p-3 d-flex flex-column align-items-center bg-${bgtheme} text-${texttheme}`}
      >
        <LeftMenu
          setShowBoomarks={setShowBoomarks}
          show={showLeftMenu}
          handleClose={() => setShowLeftMenu(false)}
          setSelectedCategory={setSelectedCategory}
        />
        {user ? (
          <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
        ) : (
          <></>
        )}
        <div className="container max-width-card">
          {user && activeTab === "dailynews" ? (
            <h2 className={`text-${bgtheme == "dark" ? "white-50" : "muted"}`}>
              Top #3 Ranked
            </h2>
          ) : (
            <></>
          )}
          {user &&
            activeTab === "dailynews" && ( // Check if user is logged in
              <div className="row">
                {top3articles.map((article) => {
                  return (
                    <div
                      key={article.articleID}
                      className="col-md-4 col-sm-12 mb-4"
                      onClick={() => handleCommentOPen(article)}
                    >
                      <div className="card32 card-animation">
                        <div className="card32-title1">{article.summary}</div>
                        <img src={article.imgURL} />
                        <div className="card32-summary">{article.title}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>

        <Row className="w-100 d-flex justify-content-center">
          {!(error || loading) ? (
            <Pagination
              className={`mt-1 pagination-${bgtheme} pagination-animation`}
            >
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
            <div className="d-flex justify-content-center align-items-center vh-100 w-100">
              <div className="text-center">
                <div
                  className="spinner-border text-primary loading-spinner-animation"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p
                  className={`text-${
                    bgtheme === "dark" ? "white-50" : "muted"
                  } mt-3`}
                >
                  Please wait, loading data...
                </p>
              </div>
            </div>
          ) : (
            <></>
          )}
          {error ? (
            <div className="container d-flex justify-content-center align-items-center vh-100">
              <div className="text-center">
                <div className="fs-1 mb-3">😞</div>
                <div
                  className={`fs-4 text-${
                    bgtheme === "dark" ? "white-50" : "muted"
                  } mt-3`}
                >
                  {articles.length === 0
                    ? "No results found"
                    : "Sorry, come back later"}
                </div>
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
                setarticleDataComment={setarticleDataComment}
                handleShow1={handleShow1}
                setshareData={setshareData}
                handleShareModalShow={handleShareModalShow}
                callFromComment={false}
                fromModal={false}
              />
            ))
          )}
        </Row>
        <Row className="w-100 d-flex justify-content-center">
          {!(error || loading) ? (
            <Pagination
              className={`pagination-${bgtheme} pagination-animation`}
            >
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
      {user ? <ProfileModal show={show} handleClose={handleClose} /> : <></>}
      {articleDataComment ? (
        <CommentModal
          show={showComments}
          onHide={handleClose1}
          articleDataComment={articleDataComment}
          setshareData={setshareData}
          handleShareModalShow={handleShareModalShow}
        />
      ) : (
        <></>
      )}
      {user ? (
        <BookMarksModal
          showbookmarks={showbookmarks}
          setShowBoomarks={setShowBoomarks}
        />
      ) : (
        <></>
      )}
      {shareData ? (
        <ShareLinkModal
          show={showshare}
          handleClose={handleShareModalClose}
          shareUrl={shareData.originURL}
          title={shareData.title}
          content={shareData.content}
          sharedata={shareData}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default HomePage;

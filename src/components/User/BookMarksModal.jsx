import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/auth";
import axios from "axios";
import {
  Row,
  Modal,
  Pagination,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import CommentModal from "../CommentModal";
import CustomCard from "../CustomCard";
import { Navigate } from "react-router-dom";
import signalRService from "../../services/signalrService";
import { jwtDecode } from "jwt-decode";

const BookMarksModal = ({ showbookmarks, setShowBoomarks }) => {
  const { user, logout } = useAuth();

  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const articlesPerPage = 10;

  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  useEffect(() => {
    if (user) {
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

  const fetchArticles = async (page) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://localhost:7285/api/SavedArticle/getallarticlesbyid",
        {
          params: {
            pageno: page,
            pagesize: articlesPerPage,
            userid: user ? parseInt(user.userID) : 0,
            query: query == "" || query == null ? "null" : query,
          },
          headers: {
            Authorization: `Bearer ${user ? user.token : ""}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      console.log(response.data);
      setArticles(data.articles);
      setTotalPages(data.totalpages);

      // Join groups for the articles
      data.articles.forEach((article) => {
        signalRService.joinGroup(article.articleID);
      });
    } catch (error) {
      setError(error.message);
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage, user, query, showbookmarks]);

  useEffect(() => {
    signalRService.start().then(() => {
      articles.forEach((article) => {
        signalRService.joinGroup(article.articleID);
      });
    });

    const commentCountListener = (articleID, newCommentCount) => {
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.articleID.toString() === articleID.toString()
            ? { ...article, commentCount: newCommentCount }
            : article
        )
      );
    };

    signalRService.onUpdateCommentCount(commentCountListener);

    return () => {
      articles.forEach((article) => {
        signalRService.leaveGroup(article.articleID);
      });
    };
  }, [articles]);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const [showComments, setShowComments] = useState(false);
  const [articleDataComment, setarticleDataComment] = useState(null);
  const handleClose1 = () => setShowComments(false);
  const handleShow1 = () => setShowComments(true);

  const handleClose = () => setShowBoomarks(false);

  return user ? (
    <>
      <Modal show={showbookmarks} onHide={handleClose} fullscreen>
        <Modal.Dialog fullscreen>
          <Modal.Header
            closeButton
            className="custom-modal-header"
          ></Modal.Header>
          <Modal.Body>
            <div className="vh-100 w-100 m-0 p-3 d-flex flex-column align-items-center">
              <Row>
                <Form className="d-flex" onSubmit={handleSearch}>
                  <FormControl
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    value={query}
                    onChange={handleSearch}
                  />
                  <Button variant="outline-success" type="submit">
                    Search
                  </Button>
                </Form>
              </Row>
              <Row className="w-100 d-flex justify-content-center mt-5">
                {!(error || loading) && articles.length > 0 ? (
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
                  <div className="d-flex justify-content-center align-items-center h-100 w-100">
                    <div className="text-center">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">
                        Please wait, loading data...
                      </p>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {error ? (
                  <div className="container d-flex justify-content-center align-items-center h-100">
                    <div className="text-center">
                      <div className="fs-1 mb-3">😞</div>
                      <div className="fs-4 text-muted">No Data Available</div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {error || loading ? (
                  <></>
                ) : articles.length > 0 ? (
                  articles.map((articleData) => (
                    <CustomCard
                      key={articleData.articleID}
                      articleData={articleData}
                      setarticleDataComment={setarticleDataComment}
                      handleShow1={handleShow1}
                    />
                  ))
                ) : (
                  <div className="container d-flex justify-content-center align-items-center h-100">
                    <div className="text-center">
                      <div className="fs-1 mb-3">😞</div>
                      <div className="fs-4 text-muted">Item not available</div>
                    </div>
                  </div>
                )}
              </Row>
              <Row className="w-100 d-flex justify-content-center">
                {!(error || loading) && articles.length > 0 ? (
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
          </Modal.Body>
        </Modal.Dialog>
      </Modal>
      {articleDataComment ? (
        <CommentModal
          show={showComments}
          onHide={handleClose1}
          articleData={articleDataComment}
        />
      ) : (
        <></>
      )}
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default BookMarksModal;

import React, { useState, useEffect } from "react";
import Table from "../../components/Admin/Table.jsx";
import { useAuth } from "../../services/auth.js";
import axios from "axios";
import EditArticleModal from "../../components/Admin/EditArticleModal.jsx";
import CategoryDropdown from "../../components/Admin/CategoryDropDown.jsx";
import { Table as BootstrapTable, Pagination } from "react-bootstrap";
import { useTheme } from "../../services/ThemeContext.jsx";
import { apiUrl } from "../../utils/constants.jsx";

const AdminArticles = ({ status, currentPage1, setCurrentPage1 }) => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("edit");
  const [selectedCategory, setSelectedCategory] = useState({
    id: 28,
    name: "Top Stories",
    description: "topstories",
  });

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when status changes
  }, [status, setCurrentPage]);

  const fetchArticles = async (pageNumber, pageSize) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${apiUrl}/Article/topstories`, {
        params: {
          categoryID: selectedCategory.id,
          pageno: pageNumber,
          pagesize: pageSize,
          status: status,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      // Adjust this according to the actual structure of the response
      const { articles: fetchedArticles, totalpages: fetchedTotalPages } =
        response.data;

      // Debugging output
      // console.log("API Response Data:", articles.length);

      setArticles(fetchedArticles);
      setTotalPages(fetchedTotalPages);
    } catch (error) {
      setError(error.message);
      // console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(currentPage, rowsPerPage);
  }, [user.token, currentPage, rowsPerPage, status, selectedCategory]);

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleView = (article) => {
    setSelectedArticle(article);
    setModalMode("view");
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedArticle(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const changeArticleStatus = async (articleId, articleStatus) => {
    setError(null);
    try {
      const response = await axios.put(
        `${apiUrl}/Article/changeArticleStatus`,
        null, // No body content for PUT with query params
        {
          params: {
            articleId: articleId,
            articleStatus: articleStatus,
          },
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // After updating the status, refetch the articles to reflect changes
      fetchArticles(currentPage, rowsPerPage);
    } catch (error) {
      setError(error.message);
      // console.error("Error changing article status:", error);
    }
  };

  const StatusAvailable = {
    0: "Pending",
    1: "Edited",
    2: "Approved",
    3: "Rejected",
  };
  const { bgtheme, texttheme } = useTheme();
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Please wait, loading data...</p>
        </div>
      </div>
    );

  return (
    <div className={`m-0 bg-${bgtheme} text-${texttheme}`}>
      <h2 className="mt-2 text-muted">{StatusAvailable[status]} Articles</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CategoryDropdown
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        {/* Pagination */}
        <Pagination className={`pagination-${bgtheme} mt-1 me-3`}>
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages).keys()].map((page) => (
            <Pagination.Item
              key={page + 1}
              active={page + 1 === currentPage}
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>

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
      ) : (
        <>
          <Table
            data={articles}
            totalPages={totalPages}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            setCurrentPage={setCurrentPage}
            changeArticleStatus={changeArticleStatus}
            onEdit={handleEdit}
            onView={handleView}
          />
          <EditArticleModal
            show={showModal}
            handleClose={handleClose}
            article={selectedArticle}
            fetchArticles={() => fetchArticles(currentPage, rowsPerPage)}
            user={user}
            mode={modalMode}
          />
        </>
      )}
    </div>
  );
};

export default AdminArticles;

import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import { useAuth } from "../../services/auth";
import axios from "axios";

const AdminArticles = ({ status }) => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticles = async (pageNumber, pageSize) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://localhost:7285/api/Article/topstories`,
        {
          params: {
            pageno: pageNumber,
            pagesize: pageSize,
            status: status,
          },
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Adjust this according to the actual structure of the response
      const { articles: fetchedArticles, totalpages: fetchedTotalPages } =
        response.data;

      // Debugging output
      console.log("API Response Data:", articles.length);

      setArticles(fetchedArticles);
      setTotalPages(fetchedTotalPages);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(currentPage, rowsPerPage);
  }, [user.token, currentPage, rowsPerPage, status]);

  const changeArticleStatus = async (articleId, articleStatus) => {
    setError(null);
    try {
      const response = await axios.put(
        `https://localhost:7285/api/Article/changeArticleStatus`,
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
      console.error("Error changing article status:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      AdminArticles
      <Table
        data={articles}
        totalPages={totalPages}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        setCurrentPage={setCurrentPage}
        changeArticleStatus={changeArticleStatus}
      />
    </div>
  );
};

export default AdminArticles;

import React, { useState, useEffect } from "react";
import ArticleCard from "../components/ArticleCard";
import LeftMenu from "../components/LeftMenu";
import RightMenu from "../components/RightMenu";
import CustomPagination from "../components/CustomPagination";
import { Container, Row, Col, Button } from "react-bootstrap";
import articlesData from "../assets/db.json";
import "../styles/user/Home.css";
// import { FaBurgee } from "react-icons/fa";

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLeftMenu, setShowLeftMenu] = useState(false);
  const [showRightMenu, setShowRightMenu] = useState(false);

  const articlesPerPage = 3;

  useEffect(() => {
    if (Array.isArray(articlesData.articles)) {
      setArticles(articlesData.articles);
    } else {
      console.error("Imported data is not an array:", articlesData);
    }
  }, []);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container>
      <LeftMenu
        show={showLeftMenu}
        handleClose={() => setShowLeftMenu(false)}
      />
      <RightMenu
        show={showRightMenu}
        handleClose={() => setShowRightMenu(false)}
      />
      <div className="w-100 d-flex justify-content-between">
        <Button variant="primary" onClick={() => setShowLeftMenu(true)}>
          Menu
        </Button>
        <Button variant="secondary" onClick={() => setShowRightMenu(true)}>
          Right Menu
        </Button>
      </div>
      <Row className="w-100 d-flex flex-col justify-content-center">
        <Col md={8}>
          {currentArticles.map((article, index) => (
            <ArticleCard
              key={index}
              article={article}
              isFocused={index === 1}
            />
          ))}
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;

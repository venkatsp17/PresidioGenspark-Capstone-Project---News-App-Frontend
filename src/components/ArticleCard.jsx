import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import "../styles/components/ArticleCard.css";

const ArticleCard = ({ article, isFocused }) => {
  return (
    <Card className={`article-card ${isFocused ? "focused" : ""}`}>
      <Row>
        <Col className="image-column d-flex justify-content-center align-items-center">
          <Card.Img variant="top" src={article.ImgURL} alt="Article image" />
        </Col>
        <Col className="content-column">
          <Card.Body>
            <Card.Title>{article.Title}</Card.Title>
            <Card.Text>{article.Summary}</Card.Text>
            <Card.Text>
              <small className="text-muted">
                {new Date(article.AddedAt).toLocaleString()}
              </small>
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default ArticleCard;

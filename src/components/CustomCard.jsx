import React, { useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import {
  FaBookmark,
  FaComment,
  FaShareSquare,
  FaRegBookmark,
} from "react-icons/fa";
import { useAuth } from "../services/auth";

const CustomCard = ({ articleData, setarticleDataComment, handleShow1 }) => {
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useAuth();

  const shortenURL = (url) => {
    const maxLength = 30;
    if (url.length <= maxLength) {
      return url;
    }
    return `${url.substring(0, maxLength)}...`;
  };

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
  };

  const handleCommentToggle = () => {
    setarticleDataComment(articleData);
    handleShow1();
  };

  return (
    <Card className="mb-3 mx-auto" style={{ maxWidth: "80%" }}>
      <Row className="g-0">
        <Col
          xs={12}
          md={12}
          className="d-flex justify-content-center align-items-center"
        >
          <Card.Img
            src={articleData.imgURL}
            className="img-fluid h-100 rounded-start"
            alt="Article Image"
            style={{ maxHeight: "200px", objectFit: "cover" }}
          />
        </Col>
        <Col xs={12} md={12}>
          <Card.Body>
            <Card.Title style={{ fontSize: "1.2em", fontWeight: "bold" }}>
              {articleData.title}
            </Card.Title>
            <Card.Subtitle
              className="mb-2 text-muted"
              style={{ fontSize: "0.9em" }}
            >
              short by {articleData.author} /{" "}
              {new Date(articleData.addedAt).toLocaleTimeString()} on{" "}
              {new Date(articleData.addedAt).toLocaleDateString()}
            </Card.Subtitle>
            <Card.Text style={{ fontSize: "0.9em" }}>
              {articleData.content}
            </Card.Text>
            <Card.Text style={{ fontSize: "0.7em" }}>
              <a
                href={articleData.originURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-wrap"
              >
                read more at {shortenURL(articleData.originURL)}
              </a>
            </Card.Text>
            {user ? (
              <Row className="mt-3">
                <Col
                  xs="auto"
                  className="d-flex align-items-center"
                  onClick={handleCommentToggle}
                >
                  <FaComment color="blue" size={20} className="me-2" />
                  <span className="text-muted">Comment</span>
                </Col>
                <Col xs="auto" className="d-flex align-items-center">
                  <Button
                    variant="link"
                    onClick={handleSaveToggle}
                    className="p-0"
                  >
                    {isSaved ? (
                      <FaBookmark size={20} className="me-2" />
                    ) : (
                      <FaRegBookmark size={20} className="me-2" />
                    )}
                  </Button>
                  <span className="text-muted">Save</span>
                </Col>
                <Col xs="auto" className="d-flex align-items-center">
                  <FaShareSquare color="blue" size={20} className="me-2" />
                  <span className="text-muted">Share</span>
                  <span className="text-muted ms-2">
                    ({articleData.shareCount})
                  </span>
                </Col>
              </Row>
            ) : (
              <></>
            )}
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default CustomCard;

import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import {
  FaBookmark,
  FaComment,
  FaShareSquare,
  FaRegBookmark,
} from "react-icons/fa";
import { useAuth } from "../services/auth";
import axios from "axios";
import { toast } from "react-toastify";

const CustomCard = ({
  articleData,
  setarticleDataComment,
  handleShow1,
  setshareData,
  handleShareModalShow,
}) => {
  const [isSaved, setIsSaved] = useState(articleData.isSaved);
  const [commentCount, SetCommentCount] = useState(articleData.commentCount);
  const [saveCount, SetSaveCount] = useState(articleData.saveCount);
  const { user } = useAuth();

  useEffect(() => {
    console.log(articleData);
    setIsSaved(articleData.isSaved);
    SetCommentCount(articleData.commentCount);
    SetSaveCount(articleData.saveCount);
  }, [articleData]);

  const shortenURL = (url) => {
    const maxLength = 30;
    if (url.length <= maxLength) {
      return url;
    }
    return `${url.substring(0, maxLength)}...`;
  };

  async function SaveUnSaveAricle(articleData) {
    try {
      const response = await axios.put(
        "https://localhost:7285/api/SavedArticle/savearticle",
        null,
        {
          params: {
            articleid: articleData.articleID,
            userid: parseInt(user.userID, 10),
          },
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      if (isSaved) {
        toast.success("Article UnSaved!");
      } else {
        toast.success("Article Saved!");
      }
      setIsSaved(!isSaved);
    } catch (error) {
      toast.error("Article not saved!");
      console.error("Error fetching articles:", error);
    } finally {
    }
  }

  const handleSaveToggle = () => {
    SaveUnSaveAricle(articleData);
  };

  const handleCommentToggle = () => {
    setarticleDataComment(articleData);
    handleShow1();
  };

  const handleShareToggle = () => {
    setshareData(articleData);
    handleShareModalShow();
  };

  return (
    <Card className="mb-3 mx-auto max-width-card">
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
            <Card.Text className="d-flex w-100 justify-content-between">
              {" "}
              <b>
                <small className="text-muted ms-2 mx-1">
                  {saveCount} saved this article
                </small>
              </b>
              <b>
                <small className="text-muted ms-2 mx-1">
                  {commentCount == 0
                    ? "Be first one to comment"
                    : commentCount == 1
                    ? `${commentCount} comment`
                    : `${commentCount} comments`}
                </small>
              </b>
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
                  <FaShareSquare
                    color="blue"
                    size={20}
                    className="me-2"
                    onClick={handleShareToggle}
                  />
                  <span className="text-muted">Share</span>
                </Col>
                <Col xs="auto" className="d-flex align-items-center">
                  <Button
                    variant="link"
                    onClick={handleSaveToggle}
                    className="p-0"
                  >
                    {isSaved ? (
                      <FaBookmark size={20} className="" />
                    ) : (
                      <FaRegBookmark size={20} className="" />
                    )}
                  </Button>
                  <span className="text-muted">Save</span>
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

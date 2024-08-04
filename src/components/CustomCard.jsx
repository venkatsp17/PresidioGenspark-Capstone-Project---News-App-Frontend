import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import {
  FaBookmark,
  FaComment,
  FaShareSquare,
  FaRegBookmark,
} from "react-icons/fa";
import { useAuth } from "../services/auth.js";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../services/ThemeContext.jsx";
import { useSavedArticles } from "../services/SaveArticleContext.jsx";
import { apiUrl } from "../utils/constants.jsx";

const CustomCard = ({
  articleData,
  setarticleDataComment,
  handleShow1,
  setshareData,
  handleShareModalShow,
  callFromComment,
  fromModal,
}) => {
  const { getArticleByID, toggleSaveArticle, savedArticles } =
    useSavedArticles();
  const [isSaved, setIsSaved] = useState(getArticleByID(articleData.articleID));
  const [commentCount, SetCommentCount] = useState(articleData.commentCount);
  const [saveCount, SetSaveCount] = useState(articleData.saveCount);
  const [shareCount, SetShareCount] = useState(articleData.shareCount);
  const { user } = useAuth();

  useEffect(() => {
    SetCommentCount(articleData.commentCount);
    SetSaveCount(articleData.saveCount);
    SetShareCount(articleData.shareCount);
    setIsSaved(getArticleByID(articleData.articleID));
  }, [articleData, savedArticles]);

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
        `${apiUrl}/SavedArticle/savearticle`,
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
      toggleSaveArticle(articleData.articleID);
      if (isSaved) {
        toast.success("Article UnSaved!");
      } else {
        toast.success("Article Saved!");
      }
    } catch (error) {
      toast.error("Article not saved!");
      // console.error("Error fetching articles:", error);
    } finally {
    }
  }

  const handleSaveToggle = () => {
    SaveUnSaveAricle(articleData);
  };

  const handleCommentToggle = () => {
    if (!callFromComment) {
      setarticleDataComment(articleData);
      handleShow1();
    }
  };

  const handleShareToggle = () => {
    setshareData(articleData);
    handleShareModalShow();
  };

  const { bgtheme, texttheme } = useTheme();

  return (
    <Card
      className={`card-animation mb-3 mx-auto max-width-card bg-${bgtheme} ${
        fromModal ? "card-modal432" : ""
      } shadow-lg`}
    >
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
            <Card.Title
              className={`text-${texttheme}`}
              style={{ fontSize: "1.2em", fontWeight: "bold" }}
            >
              {articleData.title}
            </Card.Title>
            <Card.Subtitle
              className={`mb-2 text-${
                bgtheme === "dark" ? "white-50" : "muted"
              }`}
              style={{ fontSize: "0.9em" }}
            >
              short by {articleData.author} /{" "}
              {new Date(articleData.createdAt).toLocaleTimeString()} on{" "}
              {new Date(articleData.createdAt).toLocaleDateString()}
            </Card.Subtitle>
            <Card.Text
              className={`text-${texttheme}`}
              style={{ fontSize: "0.9em" }}
            >
              {articleData.content}
            </Card.Text>
            <Card.Text style={{ fontSize: "0.7em" }}>
              <a
                href={articleData.originURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-wrap"
              >
                <span className={`text-${texttheme} me-1`}>read more at</span>
                {"   "}
                {shortenURL(articleData.originURL)}
              </a>
            </Card.Text>
            {user ? (
              <Card.Text className="row d-flex flex-column  flex-md-row  w-100 justify-content-between">
                <b className="col-12 col-md-4 text-start text-sm-start">
                  <small
                    className={`text-${
                      bgtheme === "dark" ? "white-50" : "muted"
                    } ms-2 mx-1`}
                  >
                    {saveCount} saved this article
                  </small>
                </b>
                <b className="col-12 col-md-4 text-start text-sm-center ">
                  <small
                    className={`text-${
                      bgtheme === "dark" ? "white-50" : "muted"
                    } ms-2 mx-1`}
                  >
                    {commentCount === 0
                      ? "Be first one to comment"
                      : commentCount === 1
                      ? `${commentCount} comment`
                      : `${commentCount} comments`}
                  </small>
                </b>
                <b className="col-12 col-md-4 text-start text-md-end ">
                  <small
                    className={`text-${
                      bgtheme === "dark" ? "white-50" : "muted"
                    } ms-2 mx-1`}
                  >
                    {shareCount + " shared"}
                  </small>
                </b>
              </Card.Text>
            ) : (
              <></>
            )}
            {user ? (
              <Row className="mt-3">
                <Col
                  xs="auto"
                  className="d-flex align-items-center"
                  onClick={handleCommentToggle}
                >
                  <FaComment color="blue" size={20} className="me-2" />
                  <span
                    className={`text-${
                      bgtheme === "dark" ? "white-50" : "muted"
                    } ms-2 mx-1`}
                  >
                    Comment
                  </span>
                </Col>
                <Col xs="auto" className="d-flex align-items-center">
                  <FaShareSquare
                    color="blue"
                    size={20}
                    className="me-2"
                    onClick={handleShareToggle}
                  />
                  <span
                    className={`text-${
                      bgtheme === "dark" ? "white-50" : "muted"
                    } ms-2 mx-1`}
                  >
                    Share
                  </span>
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
                  <span
                    className={`text-${
                      bgtheme === "dark" ? "white-50" : "muted"
                    } ms-2 mx-1`}
                  >
                    Save
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

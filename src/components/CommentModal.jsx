import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { useAuth } from "../services/auth.js";
import signalRService from "../services/signalrService.js";
import axios from "axios";
import CustomCard from "./CustomCard.jsx";
import { useTheme } from "../services/ThemeContext.jsx";
import { apiUrl } from "../utils/constants.jsx";
const CommentModal = ({
  show,
  onHide,
  articleDataComment,
  setshareData,
  handleShareModalShow,
}) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [articleData, setarticleData] = useState(articleDataComment);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  useEffect(() => {
    setarticleData(articleDataComment);
  }, [articleDataComment]);

  useEffect(() => {
    signalRService.start().then(() => {
      signalRService.joinGroup(articleData.articleID);
    });

    const commentCountListener = (articleID, newCommentCount) => {
      setarticleData((prevArticle) =>
        prevArticle.articleID.toString() === articleID.toString()
          ? { ...prevArticle, commentCount: newCommentCount }
          : prevArticle
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
      setarticleData((article) =>
        article.articleID.toString() === articleID.toString()
          ? { ...article, saveCount: savecount }
          : article
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
      setarticleData((prevArticle) =>
        prevArticle.articleID.toString() === articleID.toString()
          ? { ...prevArticle, shareCount: sharecount }
          : prevArticle
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
      signalRService.leaveGroup(articleData.articleID);
    };
  }, [articleData]);

  const { user } = useAuth();

  const scrollRef = useRef(null);
  const commentListenerRef = useRef(null);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${apiUrl}/Comment/getcommentsByID`, {
        params: {
          id: articleData.articleID,
          type: "ArticleID",
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      setComments(data);
    } catch (error) {
      // console.error("Error fetching articles:", error);
    }
  };

  // useEffect(() => {
  //   scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  // }, [comments]);

  useEffect(() => {
    fetchComments();
    signalRService.start().then(() => {
      signalRService.joinGroup(articleData.articleID);
    });
    if (commentListenerRef.current === null) {
      commentListenerRef.current = (comment) => {
        setComments((prevComments) => [...prevComments, comment]);
      };
      signalRService.onReceiveComment(commentListenerRef.current);
    }

    return () => {
      signalRService.leaveGroup(articleData.articleID);
    };
  }, [articleData]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    const comment = {
      articleID: articleData.articleID,
      userID: user.userID,
      content: newComment,
    };

    try {
      await axios.post(`${apiUrl}/Comment/postcomment`, comment, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      setNewComment("");
    } catch (error) {
      // console.error("There was an error posting the comment!", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const options = {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    if (date.getFullYear() !== now.getFullYear()) {
      options.year = "numeric";
    }

    return date.toLocaleDateString(undefined, options);
  };

  const { bgtheme, texttheme } = useTheme();

  return (
    <Modal
      show={show}
      onHide={onHide}
      size={window.innerWidth > 1200 ? "xl" : "lg"}
      dialogClassName="modal-dialog"
    >
      <Modal.Header closeButton className={`bg-${bgtheme} text-${texttheme}`}>
        <Modal.Title></Modal.Title>
      </Modal.Header>
      <Modal.Body className={`bg-${bgtheme} text-${texttheme}`}>
        <Row>
          <Col md={7} className="m-0 p-0">
            <CustomCard
              key={articleData.articleID}
              articleData={articleData}
              setshareData={setshareData}
              handleShareModalShow={handleShareModalShow}
              callFromComment={true}
              fromModal={true}
            />
          </Col>
          {/* Comment Section */}
          <Col md={5} className="m-0 p-1">
            <h5 className="mb-4">Comments</h5>
            <div
              ref={scrollRef}
              style={{
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {comments.length === 0 && <p>No comments yet.</p>}
              {comments.map((comment) => (
                <div
                  key={comment.commentID}
                  className="d-flex mb-3 align-items-center justify-content-start"
                >
                  <strong>{comment.userName}</strong>
                  <p className="mx-1 my-0">{comment.content}</p>
                  <small
                    className={`text-${
                      bgtheme === "dark" ? "white-50" : "muted"
                    }`}
                    style={{ fontSize: "0.7em" }}
                  >
                    {formatTimestamp(comment.timestamp)}
                  </small>
                </div>
              ))}
            </div>
            <Form onSubmit={handleCommentSubmit} className="mt-4">
              <Form.Group controlId="commentText">
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={newComment}
                  onChange={handleCommentChange}
                  placeholder="Add a comment..."
                  className={`bg-${bgtheme} text-${
                    bgtheme === "dark" ? "white-50" : "muted"
                  } border-rounded-1`}
                  style={{ resize: "none" }}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-2 w-100">
                Post Comment
              </Button>
            </Form>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default CommentModal;

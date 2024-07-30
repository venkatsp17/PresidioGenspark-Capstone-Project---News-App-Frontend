import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Row, Col, Form, Card, Image } from "react-bootstrap";
import { useAuth } from "../services/auth";
import signalRService from "../services/signalrService";
import axios from "axios";

const CommentModal = ({ show, onHide, articleData }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const { user } = useAuth();

  const shortenURL = (url) => {
    const maxLength = 30;
    if (url.length <= maxLength) {
      return url;
    }
    return `${url.substring(0, maxLength)}...`;
  };

  const scrollRef = useRef(null);
  const commentListenerRef = useRef(null);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://localhost:7285/api/Comment/getcommentsByID",
        {
          params: {
            id: articleData.articleID,
            type: "ArticleID",
          },
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      setComments(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, []);

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
      await axios.post(
        "https://localhost:7285/api/Comment/postcomment",
        comment,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setNewComment("");
    } catch (error) {
      console.error("There was an error posting the comment!", error);
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

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {/* Article Section */}
          <Col md={7}>
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
              </Row>
              <Row>
                <Col xs={12} md={12}>
                  <Card.Body>
                    <Card.Title
                      style={{ fontSize: "1.2em", fontWeight: "bold" }}
                    >
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
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
          {/* Comment Section */}
          <Col md={5}>
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
                  className="d-flex mb-3 align-items-center justify-content-start "
                >
                  <strong>{comment.userName}</strong>
                  <p className="mx-1 my-0">{comment.content}</p>
                  <small className="text-muted" style={{ fontSize: "0.7em" }}>
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
                  className="border-rounded-1"
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

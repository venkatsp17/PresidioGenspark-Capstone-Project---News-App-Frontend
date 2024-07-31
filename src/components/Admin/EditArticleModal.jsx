import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

const EditArticleModal = ({
  show,
  handleClose,
  article,
  fetchArticles,
  user,
  mode,
}) => {
  const [articleDetails, setArticleDetails] = useState({
    ArticleID: "",
    Title: "",
    Content: "",
    Summary: "",
    AddedAt: "",
    OriginURL: "",
    ImgURL: "",
    CreatedAt: "",
    ImpScore: "",
    Status: "",
    ShareCount: "",
  });

  useEffect(() => {
    if (article) {
      setArticleDetails(article);
    }
  }, [article]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticleDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `https://localhost:7285/api/Article/editArticleDetails`,
        articleDetails,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchArticles();
      toast.success("Update Successfull!");
      handleClose();
    } catch (error) {
      toast.error("Error updating article!");
      console.error("Error updating article:", error);
    }
  };

  const StatusAvailable = {
    0: "Pending",
    1: "Edited",
    2: "Approved",
    3: "Rejected",
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "view" ? "View Article" : "Edit Article"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            {Object.keys(articleDetails).map((key) => {
              if (key === "isSaved") return null; // Don't render anything for isSaved key

              return (
                <Col md={6} key={key}>
                  <Form.Group controlId={key}>
                    <Form.Label style={{ textTransform: "capitalize" }}>
                      <strong>{key}</strong>
                    </Form.Label>
                    {key === "content" ? (
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name={key}
                        value={articleDetails[key]}
                        onChange={handleChange}
                        disabled={
                          mode === "view" ||
                          key === "ArticleID" ||
                          key === "AddedAt" ||
                          key === "CreatedAt"
                        }
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        name={key}
                        value={
                          key === "status"
                            ? StatusAvailable[articleDetails[key]]
                            : articleDetails[key]
                        }
                        onChange={handleChange}
                        disabled={
                          mode === "view" ||
                          key === "articleID" ||
                          key === "createdAt" ||
                          key === "impScore" ||
                          key === "addedAt" ||
                          key === "shareCount" ||
                          key === "status" ||
                          key === "saveCount" ||
                          key === "commentCount"
                        }
                      />
                    )}
                  </Form.Group>
                </Col>
              );
            })}
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {mode !== "view" && (
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        )}
        <Button variant="secondary" onClick={handleClose}>
          {mode === "view" ? "Close" : "Cancel"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditArticleModal;

import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import Select from "react-select";

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
    Categories: [],
  });

  const [categoryOptions, setCategoryOptions] = useState();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7285/api/Category/getAllAdminCategories",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCategoryOptions(
        response.data.map((category) => ({
          value: category.id,
          label: category.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const fetchArticleCategories = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7285/api/Category/getAllAdminCategories",
        {
          params: {
            articleid: article.articleID,
          },
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      handleCategoryChange(
        response.data.map((category) => ({
          value: category.id,
          label: category.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    if (article) {
      setArticleDetails(article);
      fetchArticleCategories();
    }
  }, [article]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticleDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleCategoryChange = (selectedOptions) => {
    setArticleDetails((prevDetails) => ({
      ...prevDetails,
      Categories: selectedOptions,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedArticleDetails = {
        ...articleDetails,
        Categories: articleDetails.Categories.map((option) => option.value),
      };
      console.log(updatedArticleDetails);
      await axios.put(
        `https://localhost:7285/api/Article/editArticleDetails`,
        updatedArticleDetails,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchArticles();
      toast.success("Update Successful!");
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
              if (key === "isSaved" || key === "Categories") return null; // Don't render isSaved and Categories here

              return (
                <Col md={6} key={key}>
                  <Form.Group controlId={key}>
                    <Form.Label style={{ textTransform: "capitalize" }}>
                      <strong>{key}</strong>
                    </Form.Label>
                    {key === "Content" ? (
                      <Form.Control
                        as="textarea"
                        rows={3}
                        required
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
                        required
                        value={
                          key === "Status"
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
            {mode === "edit" && (
              <Col md={12}>
                <Form.Group controlId="Categories">
                  <Form.Label>
                    <strong>Categories</strong>
                  </Form.Label>
                  <Select
                    isMulti
                    options={categoryOptions}
                    value={articleDetails.Categories}
                    onChange={handleCategoryChange}
                  />
                </Form.Group>
              </Col>
            )}
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

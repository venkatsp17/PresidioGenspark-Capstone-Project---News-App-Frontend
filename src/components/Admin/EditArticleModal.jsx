import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import Select from "react-select";
import { useTheme } from "../../services/ThemeContext.jsx";
import { apiUrl } from "../../utils/constants.jsx";

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
        `${apiUrl}/Category/getAllAdminCategories`,
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
      // console.error("Error fetching articles:", error);
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
      // console.error("Error fetching articles:", error);
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
      // console.log(updatedArticleDetails);
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
      if (error.response && error.response.data && error.response.data.errors) {
        const validationErrors = error.response.data.errors;

        Object.values(validationErrors).forEach((errorMessages) => {
          errorMessages.forEach((message) => {
            toast.error(message);
          });
        });
      } else if (error.response.data.message) {
        const message = error.response.data.message;

        toast.error(message);
      } else {
        toast.error("Error registering. Please try again.");
      }
    }
  };

  const StatusAvailable = {
    0: "Pending",
    1: "Edited",
    2: "Approved",
    3: "Rejected",
  };

  const themes = {
    white: {
      background: "white",
      text: "black",
      border: "#007bff",
      selected: "#007bff",
      optionHover: "#e9ecef",
    },
    dark: {
      background: "#333",
      text: "white",
      border: "#0056b3",
      selected: "#0056b3",
      optionHover: "#444",
    },
  };

  const customStyles = (bgtheme, texttheme) => ({
    option: (provided, state) => ({
      ...provided,
      color: texttheme,
      backgroundColor: state.isSelected
        ? themes[bgtheme].selected
        : themes[bgtheme].background,
      "&:hover": {
        backgroundColor: themes[bgtheme].optionHover,
      },
    }),
    control: (provided) => ({
      ...provided,
      borderColor: themes[bgtheme].border,
      backgroundColor: themes[bgtheme].background,
      boxShadow: "none",
      "&:hover": {
        borderColor: themes[bgtheme].border,
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.25rem",
      border: `1px solid ${themes[bgtheme].border}`,
      backgroundColor: themes[bgtheme].background,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: texttheme,
    }),
  });

  const { bgtheme, texttheme } = useTheme();

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton className={`bg-${bgtheme} text-${texttheme}`}>
        <Modal.Title>
          {mode === "view" ? "View Article" : "Edit Article"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={`bg-${bgtheme} text-${texttheme}`}>
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
                        className={`bg-${bgtheme} text-${texttheme}`}
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
                        className={`bg-${bgtheme} text-${texttheme}`}
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
                <Form.Group
                  controlId="Categories"
                  className={`bg-${bgtheme} text-${texttheme}`}
                >
                  <Form.Label>
                    <strong>Categories</strong>
                  </Form.Label>
                  <Select
                    styles={customStyles(bgtheme, texttheme)}
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
      <Modal.Footer className={`bg-${bgtheme} text-${texttheme}`}>
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

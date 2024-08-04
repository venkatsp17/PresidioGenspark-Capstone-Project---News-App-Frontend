import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { useAuth } from "../../services/auth.js";
import "../../styles/components/Table.css";
import { useTheme } from "../../services/ThemeContext.jsx";
import { toast } from "react-toastify";
import { apiUrl } from "../../utils/constants.jsx";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
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
      setCategories(response.data);
    } catch (error) {
      setError(error.message);
      // console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteCategoryId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.put(`${apiUrl}/Category/removecategory`, null, {
        params: {
          categoryid: deleteCategoryId,
        },
      });
      toast.success("Category Deleted successfully!");
      fetchCategories();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Error deleting category");
      // console.error("Error deleting category:", error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${apiUrl}/Category/addcategory`,
        {
          name: name,
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Category Added!");
      setName("");
      setDescription("");
      fetchCategories();
      setShowAddModal(false);
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

  const { bgtheme, texttheme } = useTheme();

  return (
    <div className={`container bg-${bgtheme} text-${texttheme}`}>
      <div className={`row bg-${bgtheme} text-${texttheme}`}>
        <div className="col-12 m-0">
          <h2 className={`text-${bgtheme == "dark" ? "white-50" : "muted"}`}>
            Categories
          </h2>
        </div>
      </div>
      <div className="row mb-1">
        <div className="col-12">
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            Add Category
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-12 table-container table-scroll">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center vh-100 w-100">
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p
                  className={`text-${
                    bgtheme == "dark" ? "white-50" : "muted"
                  } mt-3`}
                >
                  Please wait, loading data...
                </p>
              </div>
            </div>
          ) : (
            <></>
          )}
          {error ? (
            <div className="container d-flex justify-content-center align-items-center vh-100">
              <div className="text-center">
                <div className="fs-1 mb-3">😞</div>
                <div
                  className={`fs-4 text-${
                    bgtheme == "dark" ? "white-50" : "muted"
                  } mt-3`}
                >
                  Sorry, come back later
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          <Table
            striped
            bordered
            hover
            className={`table custom-table ${
              bgtheme === "dark" ? "dark-mode" : "light-mode"
            } text-${texttheme}`}
          >
            <thead>
              <tr>
                <th className={`bg-${bgtheme} text-${texttheme}`}>ID</th>
                <th className={`bg-${bgtheme} text-${texttheme}`}>Name</th>
                <th className={`bg-${bgtheme} text-${texttheme}`}>
                  Description
                </th>
                <th className={`bg-${bgtheme} text-${texttheme}`}>Type</th>
                <th className={`bg-${bgtheme} text-${texttheme}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {error || loading ? (
                <></>
              ) : (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td className={`bg-${bgtheme} text-${texttheme}`}>
                      {category.id}
                    </td>
                    <td className={`bg-${bgtheme} text-${texttheme}`}>
                      {category.name}
                    </td>
                    <td className={`bg-${bgtheme} text-${texttheme}`}>
                      {category.description}
                    </td>
                    <td className={`bg-${bgtheme} text-${texttheme}`}>
                      {category.type}
                    </td>
                    <td className={`bg-${bgtheme} text-${texttheme}`}>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteClick(category.id)}
                        disabled={
                          category.type == "CUSTOM_CATEGORY" ||
                          category.type == "NEWS_CATEGORY"
                        }
                      >
                        X
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton className={`bg-${bgtheme} text-${texttheme}`}>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`bg-${bgtheme} text-${texttheme}`}>
          Are you sure you want to delete this category?
        </Modal.Body>
        <Modal.Footer className={`bg-${bgtheme} text-${texttheme}`}>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAddModal}
        onHide={() => {
          setShowAddModal(false);
        }}
      >
        <Modal.Header closeButton className={`bg-${bgtheme} text-${texttheme}`}>
          <Modal.Title className={`bg-${bgtheme} text-${texttheme}`}>
            Add Category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={`bg-${bgtheme} text-${texttheme}`}>
          <Form onSubmit={handleAddCategory}>
            <Form.Group controlId="formCategoryName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                className={`bg-${bgtheme} text-${texttheme}`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCategoryDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                className={`bg-${bgtheme} text-${texttheme}`}
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="mt-3"
              onClick={handleAddCategory}
            >
              Add Category
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminCategories;

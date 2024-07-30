import React, { useState, useEffect } from "react";
import { Offcanvas, ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { useAuth } from "../services/auth";
import axios from "axios";
import { FaRegBookmark } from "react-icons/fa";

const LeftMenu = ({
  show,
  handleClose,
  setSelectedCategory,
  setShowBoomarks,
}) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7285/api/Category/getAllCategories",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setCategories(response.data); // Adjust according to the API response structure
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSelect = (category) => {
    setSelectedCategory(category);
    handleClose();
    // You can perform further actions with the selected category here
  };
  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Header>
          {user ? (
            <Offcanvas.Title>
              <Button
                onClick={() => {
                  setShowBoomarks(true);
                }}
                className="button-default"
              >
                {" "}
                My Bookmarks <FaRegBookmark size={20} className="me-2" />
              </Button>
            </Offcanvas.Title>
          ) : (
            <></>
          )}
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ListGroup>
            {categories.map((category) => (
              <ListGroup.Item
                key={category.id}
                onClick={() => handleSelect(category)}
                action
              >
                {category.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default LeftMenu;

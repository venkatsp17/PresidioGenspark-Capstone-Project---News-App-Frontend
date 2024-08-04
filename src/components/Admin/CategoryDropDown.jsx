import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import { useAuth } from "../../services/auth.js";
import { apiUrl } from "../../utils/constants.jsx";

const CategoryDropdown = ({ selectedCategory, setSelectedCategory }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/Category/getAllCategories`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setCategories(response.data); // Adjust according to the API response structure
      } catch (error) {
        // console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSelect = (category) => {
    setSelectedCategory(category);
    // You can perform further actions with the selected category here
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {selectedCategory ? selectedCategory.name : "Select Category"}
      </Dropdown.Toggle>

      <Dropdown.Menu
        className="dropdown-animation"
        style={{ maxHeight: "400px", overflowY: "auto" }}
      >
        {categories.map((category) => (
          <Dropdown.Item
            key={category.id}
            onClick={() => handleSelect(category)}
          >
            {category.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CategoryDropdown;

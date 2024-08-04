import React, { useEffect, useState } from "react";
import { Modal, Button, Container, Row, Col, Table } from "react-bootstrap";
import "../styles/components/ProfileModal.css"; // Import custom CSS
import { useAuth } from "../services/auth.js";
import { Navigate } from "react-router-dom";
import { useTheme } from "../services/ThemeContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "../utils/constants.jsx";

const ProfileModal = ({ show, handleClose }) => {
  const { user } = useAuth();
  const { bgtheme, setbgTheme, setTextSize, texttheme, settextTheme } =
    useTheme();

  const toggleTheme = () => {
    setbgTheme(bgtheme == "dark" ? "white" : "dark");
    settextTheme(texttheme == "dark" ? "white" : "dark");
  };

  const setDefaultTextSize = () => {
    setTextSize("default");
  };

  const setLargeTextSize = () => {
    setTextSize("large");
  };

  const [preferences, setPreferences] = useState([]);
  const [userPreferences, setUserPreferences] = useState({});

  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/Category/getAllCategories`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setPreferences(response.data);
      } catch (error) {
        // console.error("Error fetching categories:", error);
      }
    };

    const fetchpreferences = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/UserPreference/getpreferences`,
          {
            params: {
              userid: user.userID,
            },
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const preferences = response.data;
        // console.log(response.data);
        const mappedPreferences = preferences.reduce((acc, pref) => {
          acc[pref.categoryID] = pref.preference;
          return acc;
        }, {});
        setUserPreferences(mappedPreferences);
      } catch (error) {
        // console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
    fetchpreferences();
  }, []);

  const PostPreferences = async () => {
    try {
      await axios.post(
        `${apiUrl}/UserPreference/addpreferences`,
        {
          userID: user.userID,
          preferences: userPreferences,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Preferences Updated!");
    } catch (error) {
      toast.success("Error Updating Preferences!");
      // console.error("Error fetching categories:", error);
    }
  };

  const handlePreferenceChange = (key, value) => {
    setUserPreferences((prev) => {
      const newPreferences = { ...prev };
      if (prev[key] === value) {
        delete newPreferences[key];
      } else {
        newPreferences[key] = value;
      }
      return newPreferences;
    });
  };

  return user ? (
    <>
      <Modal show={show} onHide={handleClose} fullscreen>
        <Modal.Header closeButton className={`bg-${bgtheme} text-${texttheme}`}>
          <Modal.Title>Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`bg-${bgtheme} text-${texttheme}`}>
          <Container>
            <Row className="d-flex justify-content-center text-center mb-3">
              <Col
                md={12}
                className="d-flex justify-content-center text-center"
              >
                <div className="avatar-placeholder">{user.name[0]}</div>
              </Col>
              <Col md={12} className="mt-2">
                <h2 className="welcome-message">Welcome, {user.name}</h2>
                <p className="info-text">
                  Manage your info, accessibility work better for you.
                </p>
              </Col>
            </Row>
            <Row>
              <Col
                md={12}
                className={`basic-info bg-${bgtheme} text-${texttheme}`}
              >
                <h3>Basic info</h3>
                <table className={`table table-hover  text-${texttheme}`}>
                  <tbody>
                    <tr>
                      <th className={`bg-${bgtheme} text-${texttheme}`}>
                        Name
                      </th>
                      <td className={`bg-${bgtheme} text-${texttheme}`}>
                        {user.name}
                      </td>
                    </tr>
                    <tr>
                      <th className={`bg-${bgtheme} text-${texttheme}`}>
                        Email
                      </th>
                      <td className={`bg-${bgtheme} text-${texttheme}`}>
                        {user.email}
                      </td>
                    </tr>
                    <tr>
                      <th className={`bg-${bgtheme} text-${texttheme}`}>
                        Password
                      </th>
                      <td className={`bg-${bgtheme} text-${texttheme}`}>
                        <input
                          type="password"
                          className="form-control"
                          value={"********"}
                          readOnly
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Button variant="outline-primary" className="mt-3">
                  Change Password
                </Button>
              </Col>
            </Row>
            <Row>
              <Col md={12} className="contact-info">
                <h3>Accessibility</h3>
                <table className={`table table-hover text-${texttheme}`}>
                  <tbody>
                    <tr key={1}>
                      <th className={`bg-${bgtheme} text-${texttheme}`}>
                        Text Size
                      </th>
                      <td className={`text-${texttheme} bg-${bgtheme}`}>
                        <Button
                          variant="outline-primary"
                          className="p-1"
                          onClick={setDefaultTextSize}
                        >
                          Default
                        </Button>
                        <Button
                          variant="outline-primary"
                          className="p-1 mx-2"
                          onClick={setLargeTextSize}
                        >
                          Large
                        </Button>
                      </td>
                    </tr>
                    <tr key={2}>
                      <th className={`bg-${bgtheme} text-${texttheme}`}>
                        Night Mode
                      </th>
                      <td className={`text-${texttheme} bg-${bgtheme}`}>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckDefault"
                            checked={bgtheme === "dark"}
                            onChange={toggleTheme}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexSwitchCheckDefault"
                          ></label>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
              <Col md={12} className="contact-info">
                <h3>Preferences</h3>
                <Table bordered hover className={`table text-${texttheme}`}>
                  <thead>
                    <tr>
                      <th className={`bg-${bgtheme} text-${texttheme}`}>
                        Category
                      </th>
                      <th className={`bg-${bgtheme} text-${texttheme}`}>
                        Preference
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {preferences.map((pref) =>
                      pref.type === "NEWS_CATEGORY" ? (
                        <tr key={pref.id}>
                          <td className={`bg-${bgtheme} text-${texttheme}`}>
                            {pref.name}
                          </td>
                          <td
                            className={`bg-${bgtheme} text-${texttheme} preference-buttons`}
                          >
                            <Button
                              variant={
                                userPreferences[pref.id] === 0
                                  ? "success"
                                  : "outline-secondary"
                              }
                              onClick={() => handlePreferenceChange(pref.id, 0)}
                            >
                              👍
                            </Button>
                            <Button
                              variant={
                                userPreferences[pref.id] === 1
                                  ? "danger"
                                  : "outline-secondary"
                              }
                              onClick={() => handlePreferenceChange(pref.id, 1)}
                            >
                              👎
                            </Button>
                          </td>
                        </tr>
                      ) : null
                    )}
                  </tbody>
                </Table>
              </Col>
              <Col md={12} className="d-flex justify-content-end">
                <Button variant="primary" onClick={PostPreferences}>
                  Save Changes
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default ProfileModal;

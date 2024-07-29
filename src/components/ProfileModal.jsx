import React, { useState } from "react";
import { Modal, Button, Container, Row, Col } from "react-bootstrap";
import "../styles/components/ProfileModal.css"; // Import custom CSS
import { useAuth } from "../services/auth";
import { Navigate } from "react-router-dom";

const ProfileModal = ({ show, handleClose }) => {
  const { user } = useAuth();

  return user ? (
    <>
      <Modal show={show} onHide={handleClose} fullscreen>
        <Modal.Dialog fullscreen>
          <Modal.Header
            closeButton
            className="custom-modal-header"
          ></Modal.Header>
          <Modal.Body>
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
                <Col md={12} className="basic-info">
                  <h3>Basic info</h3>
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Name</th>
                        <td> {user.name}</td>
                      </tr>
                      <tr>
                        <th>Email</th>
                        <td>{user.email}</td>
                      </tr>
                      <tr>
                        <th>Password</th>
                        <td>
                          {" "}
                          <input
                            type="password"
                            id="registerPassword"
                            className="form-control w-xl-25 w-lg-50 w-md-100"
                            value={"444444444"}
                            // onChange={(e) => setPassword(e.target.value)}
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
                  <h3>Preferences</h3>
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Text Size</th>
                        <td>
                          <Button variant="outline-primary" className="p-1">
                            Default
                          </Button>
                          <Button
                            variant="outline-primary"
                            className="p-1 mx-2"
                          >
                            Large
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <th>Night Mode</th>
                        <td>
                          <div class="form-check form-switch">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="flexSwitchCheckDefault"
                            />
                            <label
                              class="form-check-label"
                              for="flexSwitchCheckDefault"
                            ></label>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal.Dialog>
      </Modal>
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default ProfileModal;

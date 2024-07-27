import React from "react";
import { Offcanvas, Button } from "react-bootstrap";

const RightMenu = ({ show, handleClose }) => {
  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Menu</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>{/* Add menu items here */}</Offcanvas.Body>
    </Offcanvas>
  );
};

export default RightMenu;

import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { FaHome, FaNewspaper } from "react-icons/fa"; // Example of icons

const TabBar = ({ activeTab, onTabChange }) => {
  return (
    <div className="d-flex justify-content-center mt-2 p-4">
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => onTabChange(k)}
        className="mb-3"
        variant="pills"
      >
        <Tab
          eventKey="myfeeds"
          title={
            <>
              <FaHome /> My Feeds
            </>
          }
          className="tab-content"
        ></Tab>
        <Tab
          eventKey="dailynews"
          title={
            <>
              <FaNewspaper /> Daily News
            </>
          }
          className="tab-content"
        ></Tab>
      </Tabs>
    </div>
  );
};

export default TabBar;

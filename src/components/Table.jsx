import React, { useState } from "react";
import {
  Table as BootstrapTable,
  Pagination,
  Form,
  Button,
} from "react-bootstrap";
import { FaCheck, FaTimes, FaEdit } from "react-icons/fa";
import "../styles/components/Table.css";

const Table = ({
  data,
  totalPages,
  currentPage,
  rowsPerPage,
  setRowsPerPage,
  setCurrentPage,
  changeArticleStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search query changes
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (articleId, status) => {
    changeArticleStatus(articleId, status);
  };

  return (
    <div className="container mt-4 d-flex-column justify-content-center">
      {/* Table Header */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <Form.Control
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Form.Select
          className="w-auto"
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
        >
          <option value="10">10 rows per page</option>
          <option value="20">20 rows per page</option>
          <option value="30">30 rows per page</option>
        </Form.Select>
      </div>

      {/* Table with Scroll */}
      <div className="table-container table-scroll">
        <BootstrapTable striped bordered hover responsive>
          <thead>
            <tr>
              <th># Article ID</th>
              <th>Title</th>
              <th>Summary</th>
              <th>Added At</th>
              <th>Origin URL</th>
              <th>Created At</th>
              <th>Impact Score</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.articleID}>
                  <td>{item.articleID}</td>
                  <td className="text-truncate" style={{ maxWidth: "150px" }}>
                    {item.title}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: "150px" }}>
                    {item.summary}
                  </td>
                  <td>{new Date(item.addedAt).toLocaleString()}</td>
                  <td className="text-truncate" style={{ maxWidth: "150px" }}>
                    <a
                      href={item.originURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-truncate"
                      style={{ maxWidth: "150px" }}
                    >
                      {item.originURL}
                    </a>
                  </td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                  <td>{item.impScore}</td>
                  <td>{item.status}</td>
                  <td>
                    <div className="d-flex justify-content-around">
                      <Button
                        variant="success"
                        size="sm"
                        className="mx-1"
                        onClick={() => handleStatusChange(item.articleID, 2)}
                      >
                        <FaCheck />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="mx-1"
                        onClick={() => handleStatusChange(item.articleID, 3)}
                      >
                        <FaTimes />
                      </Button>
                      <Button variant="warning" size="sm" className="mx-1">
                        <FaEdit />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </BootstrapTable>
      </div>

      {/* Pagination */}
      <Pagination className="mt-3">
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages).keys()].map((page) => (
          <Pagination.Item
            key={page + 1}
            active={page + 1 === currentPage}
            onClick={() => handlePageChange(page + 1)}
          >
            {page + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
};

export default Table;

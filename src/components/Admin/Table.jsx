import React, { useState } from "react";
import {
  Table as BootstrapTable,
  Pagination,
  Form,
  Button,
} from "react-bootstrap";
import { FaCheck, FaTimes, FaEdit, FaEye } from "react-icons/fa";
import "../../styles/components/Table.css";
import { useTheme } from "../../services/ThemeContext.jsx";

const Table = ({
  data,
  totalPages,
  currentPage,
  rowsPerPage,
  setRowsPerPage,
  setCurrentPage,
  changeArticleStatus,
  onEdit,
  onView,
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

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (articleId, status) => {
    changeArticleStatus(articleId, status);
  };
  const { bgtheme, texttheme } = useTheme();

  return (
    <div className="container d-flex-column justify-content-center ">
      {/* Table Header */}
      <div className="mb-2 d-flex justify-content-between align-items-center">
        <Form.Control
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={`bg-${bgtheme} text-${texttheme}`}
        />
        <Form.Select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className={`w-auto bg-${bgtheme} text-${texttheme}`}
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
              <th className={`bg-${bgtheme} text-${texttheme}`}>
                # Article ID
              </th>
              <th className={`bg-${bgtheme} text-${texttheme}`}>Title</th>
              <th className={`bg-${bgtheme} text-${texttheme}`}>Summary</th>
              <th className={`bg-${bgtheme} text-${texttheme}`}>Added At</th>
              <th className={`bg-${bgtheme} text-${texttheme}`}>Origin URL</th>
              <th className={`bg-${bgtheme} text-${texttheme}`}>Created At</th>
              <th className={`bg-${bgtheme} text-${texttheme}`}>
                Impact Score
              </th>
              <th className={`bg-${bgtheme} text-${texttheme}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.articleID}>
                  <td className={`bg-${bgtheme} text-${texttheme}`}>
                    {item.articleID}
                  </td>
                  <td
                    className={`bg-${bgtheme} text-${texttheme}`}
                    style={{ maxWidth: "150px" }}
                  >
                    {item.title}
                  </td>
                  <td
                    className={`bg-${bgtheme} text-${texttheme}`}
                    style={{ maxWidth: "150px" }}
                  >
                    {item.summary}
                  </td>
                  <td className={`bg-${bgtheme} text-${texttheme}`}>
                    {new Date(item.addedAt).toLocaleString()}
                  </td>
                  <td
                    className={`bg-${bgtheme} text-${texttheme} text-truncate`}
                    style={{ maxWidth: "150px" }}
                  >
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
                  <td className={`bg-${bgtheme} text-${texttheme}`}>
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className={`bg-${bgtheme} text-${texttheme}`}>
                    {item.impScore}
                  </td>
                  <td className={`bg-${bgtheme} text-${texttheme}`}>
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
                      <Button
                        variant="info"
                        size="sm"
                        className="mx-1"
                        onClick={() => onView(item)}
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        className="mx-1"
                        onClick={() => onEdit(item)}
                      >
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
    </div>
  );
};

export default Table;

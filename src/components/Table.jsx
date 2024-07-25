import React, { useState } from 'react';
import '../styles/components/Table.css'; // Ensure your CSS file is imported

const Table = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0); // Example placeholder for total rows

  // Example data; replace this with actual data fetching
  const data = []; // Fetch or define your data here

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container">
      {/* Table Header */}
      <div className="table-header">
        <div className="search-section">
          <div className="search-input">
            <svg
              className="search-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m2.65-6.65a8 8 0 11-16 0 8 8 0 0116 0z"
              />
            </svg>
            <input
              id="searchInput"
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
      <div id="emptyMessage" className="empty-message" style={{ display: 'none' }}>
        Order list is empty.
      </div>
      {/* Table */}
      <table className="table">
        <thead>
          <tr>
            <th># Article ID</th>
            <th>Order Date</th>
            <th>Status</th>
            <th>Total Amount</th>
            <th>Shipping Method</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.date}</td>
                <td className={`status ${item.status}`}>{item.status}</td>
                <td>{item.totalAmount}</td>
                <td>{item.shippingMethod}</td>
                <td></td>
                <td></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="glass-effect pagination-container">
        <div className="text-gray">
          <span id="currentRange">0</span> of <span id="totalCount">0</span>
        </div>
        <div className="pagination-options">
          <span className="text-gray margin-right">Rows per page:</span>
          <select
            id="rowsPerPage"
            className="text-grey focus-ring"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
          <div className="pagination">
            <button
              id="prevPage"
              className="pagination-button focus-ring"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              &lt;
            </button>
            <span id="pageNumber" className="page-number">
              {currentPage}
            </span>
            /<span id="totalPages">10</span>
            <button
              id="nextPage"
              className="pagination-button focus-ring"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;

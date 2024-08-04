import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../services/auth.js";
import { useTheme } from "../../services/ThemeContext.jsx";
import { apiUrl } from "../../utils/constants.jsx";

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const { user } = useAuth();

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${apiUrl}/Article/dashboarddata`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      setStatistics(response.data);
    } catch (error) {
      // console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const { bgtheme, texttheme } = useTheme();

  if (!statistics) {
    return <div>Loading...</div>;
  }

  const Typelist = ["Most Commented", "Most Saved", "Most Shared"];
  return (
    <Container fluid>
      <Row className="my-4">
        <Col>
          <h1 className="fadeInUp">Dashboard</h1>
        </Col>
      </Row>
      <Row className="d-flex justify-content-evenly">
        <Col md={2}>
          <Card className="mb-4 card765">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text>{statistics.totalUserCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="mb-4 card765">
            <Card.Body>
              <Card.Title>Total Pending Articles</Card.Title>
              <Card.Text>{statistics.totalPendingArticleCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="mb-4 card765">
            <Card.Body>
              <Card.Title>Total Approved Articles</Card.Title>
              <Card.Text>{statistics.totalApprovedArticleCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="mb-4 card765">
            <Card.Body>
              <Card.Title>Total Edited Articles</Card.Title>
              <Card.Text>{statistics.totalEditedArticleCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="mb-4 card765">
            <Card.Body>
              <Card.Title>Total Rejected Articles</Card.Title>
              <Card.Text>{statistics.totalRejectedArticleCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="fadeInUp">Top Articles</h2>
          <Table striped bordered hover className="table-animated">
            <thead>
              <tr className="table-header-animated">
                <th className={`bg-${bgtheme} text-${texttheme}`}>#</th>
                <th className={`bg-${bgtheme} text-${texttheme}`}>Title</th>
                <th className={`bg-${bgtheme} text-${texttheme}`}>
                  Categories
                </th>
                <th className={`bg-${bgtheme} text-${texttheme}`}>Comments</th>
                <th className={`bg-${bgtheme} text-${texttheme}`}>Saves</th>
                <th className={`bg-${bgtheme} text-${texttheme}`}>Shares</th>
              </tr>
            </thead>
            <tbody>
              {[
                statistics.mostCommentedArticle,
                statistics.mostSavedArticle,
                statistics.mostSharedArticle,
              ].map((article, index) => (
                <tr key={index}>
                  <td className={`bg-${bgtheme} text-${texttheme}`}>
                    {Typelist[index]}
                  </td>
                  <td className={`bg-${bgtheme} text-${texttheme}`}>
                    {article.title}
                  </td>
                  <td className={`bg-${bgtheme} text-${texttheme}`}>
                    {article.categories.join(", ")}
                  </td>
                  <td className={`bg-${bgtheme} text-${texttheme}`}>
                    {article.commentCount}
                  </td>
                  <td className={`bg-${bgtheme} text-${texttheme}`}>
                    {article.saveCount}
                  </td>
                  <td className={`bg-${bgtheme} text-${texttheme}`}>
                    {article.shareCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2 className="fadeInUp">Category Preferences</h2>
          <Table striped bordered hover className="table-animated">
            <thead>
              <tr className="table-header-animated">
                <th className={`bg-${bgtheme} text-${texttheme}`}>Category</th>
                <th className={`bg-${bgtheme} text-${texttheme}`}>Likes</th>
                <th className={`bg-${bgtheme} text-${texttheme}`}>Dislikes</th>
              </tr>
            </thead>
            <tbody>
              {statistics.categoryPreferences.map((category, index) => (
                <tr key={index}>
                  <td className={`bg-${bgtheme} text-${texttheme}`}>
                    {category.categoryName}
                  </td>
                  <td className={`bg-${bgtheme} text-${texttheme}`}>
                    {category.likes}
                  </td>
                  <td className={`bg-${bgtheme} text-${texttheme}`}>
                    {category.dislikes}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;

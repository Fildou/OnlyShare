import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import CardComponent from "../components/main/card";
import "./HomePage.css";
import "../components/main/card.css";
import axios from "axios";

const HomePage = () => {
  const [questions, setQuestions] = useState([]);

  const posts = [
  
  ];

  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("/api/questions");
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

  const allPosts = [...questions, ...posts].sort((a, b) => b.id - a.id);

  console.log(allPosts)

  return (
    <Container>
      <h1 className="posts-heading">Posts</h1>
      <Row>
        {allPosts.map((post) => (
          <Col key={post.id} md="12" className="mb-4">
            <CardComponent
              title={post.title}
              text={post.text || post.description}
              date={formatDate(post.date || post.createdAt)}
              postId={post.id}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HomePage;
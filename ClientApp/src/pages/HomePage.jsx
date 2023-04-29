import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import {Link, useNavigate} from "react-router-dom";
import CardComponent from "../components/main/card";
import "./HomePage.css";
import "../components/main/card.css";
import axios from "axios";
import {useAuth} from "../middleware/authContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {} from '@fortawesome/free-brands-svg-icons';

const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const { isLoggedIn, toggleLogin, user } = useAuth();
  const navigate = useNavigate();
  const posts = [
  
  ];

  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("/api/questions/getquestions");
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

    const handleCreateQuestion = () => {
        if (isLoggedIn) {
            navigate("/createQuestion");
        } else {
            navigate("/login");
        }
    };
  
  return (
      <Container>
          <input className="form-check-input w-100 h-25 mb-5" placeholder="Search.."/>
          <div className="d-flex  align-items-center justify-content-between mb-5">
              <h1 className="post-text">Questions</h1>
              <button className="btn btn-primary" onClick={handleCreateQuestion}>Create</button>
          </div>
          <Row>
              {allPosts.map((post) => (
                  <Col key={post.id} md="12" className="mb-4">
                      <CardComponent
                          title={post.title}
                          username={
                              post.createdByUserId ? (
                                  <Link to={`/profile/${post.createdByUserId}`}>
                                      {post.createdByUserName}
                                  </Link>
                              ) : (
                                  <span>{post.createdByUserName}</span>
                              )
                          }
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
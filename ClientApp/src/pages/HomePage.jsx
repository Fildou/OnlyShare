import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "reactstrap";
import CardComponent from "../components/main/card";
import "./HomePage.css";
import "../components/main/card.css";

const HomePage = () => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        fetch("/api/questions")
            .then((response) => response.json())
            .then((data) => setQuestions(data))
            .catch((error) => console.error(error));
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <Container>
            <h1 className="posts-heading">Posts</h1>
            <Row>
                {questions.map((question) => (
                    <Col key={question.id} md="12" className="mb-4">
                        <CardComponent
                            title={question.title}
                            text={question.description}
                            date={formatDate(question.createdAt)}
                            postId={question.id}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default HomePage;

﻿import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "reactstrap";
import CardComponent from "../components/main/card";
import "./UserQuestion.css";
import "../components/main/card.css";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';


function UserQuestions() {
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const response = await fetch("/api/questions/getQuestionsByUserId", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const data = await response.json();
                setQuestions(data);
            } catch (error) {
                setError(error.message);
            }
        }
        fetchQuestions();
    }, []);

    const handleDelete = async (id) => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this question!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });
    
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`/api/questions/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          if (!response.data.success) {
            throw new Error(response.data.message);
          }
          setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
          toast.success("DELETED");
        } catch (error) {
          setTimeout(() => {
              window.location.reload();
            }, 1000);
          toast.success("Deleted");
        }
      }
    };
    
    
    if (error) {
        return <div>{error}</div>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    

    return (
        <div>
            <Container>
                <h1 className="posts-heading">My posts</h1>
                <Row>
                    {questions.map((post) => (
                        <Col key={post.id} md="12" className="mb-4">
                            <CardComponent
                                title={post.title}
                                username={post.createdByUserName}
                                text={post.text || post.description}
                                date={formatDate(post.date || post.createdAt)}
                                postId={post.id}
                            />
                            <Button color="danger" onClick={() => handleDelete(post.id)}>Delete</Button>
                            <Button  href={`/postEdit/${post.id}`} color="primary" >Edit</Button>
                        </Col>
                    ))}
                </Row>
                <ToastContainer />
            </Container>
        </div>
    );
}

export default UserQuestions;

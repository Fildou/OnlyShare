import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, FormGroup, Input, Label, FormText } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import "./QuestionDetailPage.css";


const EditQuestion = () => {
    const { postId } = useParams();
    const [post, setPost] = useState([]);
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    
    const [comments, setComments] = useState([]);
    const [question, setQuestion] = useState("");
    const [content, setContent] = useState("");
    const [contentError, setContentError] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setQuestion(postId)
                const response = await axios.get(`/api/questions/getquestions`);
                const post = response.data.find((p) => p.id === postId);
                setPost(post);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };

        fetchPost();
    }, []);
    
    if (!post) {
        return <div>Loading...</div>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const token = localStorage.getItem("token");
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
    
    const handleSave = async () => {
        try {
            const response = await axios.put(`/api/questions/${post.id}`, {
            title, description
            }, config);
            setQuestion(response.data);
            toast.success("Question updated successfully!");
        } catch (error) {
            console.error("Error updating question:", error);
            toast.error("Failed to update question");
        }
    };
    
    return (
        <div className="container form-create">
            <h1 className="post-text">Question detail</h1>
            <Form>
                <FormGroup>
                    <Label>Title</Label>
                    <Input type="text" name="title" id="title" placeholder={post.title} value={title} onChange={(e) => setTitle(e.target.value)} />
                </FormGroup>

                <FormGroup>
                    <Label for="description">Description</Label>
                    <Input
                        type="textarea"
                        name="description"
                        id="description"
                        placeholder={post.description}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </FormGroup>
                <button className="btn btn-primary" onClick={handleSave}>SAVE</button>
            </Form>
            <ToastContainer />
        </div>
    );
};

export default EditQuestion;


  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import { Button, Form, FormGroup, Input, Label, FormText } from "reactstrap";
  import { Col, Container, Row } from "reactstrap";
  import CardComponent from "../components/main/card";
  import { toast, ToastContainer } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import { useNavigate, useParams } from "react-router-dom";
  import "./QuestionDetailPage.css";
import CommentComponent from "../components/main/comment";


  const QuestionDetailPage = () => {
    const { postId } = useParams();
    const [post, setPost] = useState([]);

    const [comments, setComments] = useState([]);
    const [question, setQuestion] = useState("");
    const [content, setContent] = useState("");
    const [contentError, setContentError] = useState("");
    const navigate = useNavigate();

    const handleSave = async (e) => {
      
      e.preventDefault();

      // setContentError(validateField(content));

      if(content){
        try{
          const token = localStorage.getItem("token");
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          };

          const response = await axios.post(
            "/api/comment/AddComment",
            {content, question},
            config
          );

          toast.success("Comment created successfully!");
          setTimeout(() => {
            window.location.reload()
          }, 3000);
        } catch (error) {
          console.error(error);
          toast.error("An error occurred while creating the comment.");
        }
        }
      };
    

    useEffect(() => {
      const fetchPost = async () => {
        try {
          setQuestion(postId)
          const response = await axios.get(`/api/questions`);
          const post = response.data.find((p) => p.id === postId);
          setPost(post);
        } catch (error) {
          console.error("Error fetching post:", error);
        }
      };
      
      fetchPost();
    }, []);


    useEffect(() => {
      const fetchComments = async () => {
        try {
          const response = await axios.get("/api/comment");
          const commentsFiltered = [...response.data.filter(c => c.questionId === postId.toString())];
          setComments(commentsFiltered);
        } catch (error) {
          console.error("Error fetching questions:", error);
        }
      };
      fetchComments();
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
  
  
    return (
      <div  className="container form-create">
        <h1>Question detail</h1>
        <Form onSubmit={handleSave}>

          <FormGroup>
            <Label>Title</Label>
            <Input disabled
              type="form-label"
              name="title"
              id="title"
              placeholder={post.title}/>
          </FormGroup>

          <FormGroup>
            <Label for="description">Description</Label>
            <Input disabled
              type="textarea"
              name="description"
              id="description"
              placeholder={post.description}/>
          </FormGroup>

          <FormGroup>
            <Label for="content">Napíšte komentar</Label>
            
            <Input 
              type="textarea"
              name="content"
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Sem napíšte komentár"/>
              {contentError && <div className="error">{contentError}</div>}
              <Button type="submit" className="">
              Pridať komentár
            </Button>
            </FormGroup>

            {comments.map((comment) =>(
              <CommentComponent
              title={comment.id}
              text={comment.content}
              date={formatDate(comment.createdAt)}
            />
            ))}

          
        </Form>
        <ToastContainer />
      </div>
    );


  };

  export default QuestionDetailPage;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, FormGroup, Input, Label, FormText } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import "./QuestionDetailPage.css";

const QuestionDetailPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/questions`);
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
 
  return (
    <div  className="container form-create">
      <h1>Question detail</h1>
      <Form>

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
          <Label for="description">Napíšte komentar</Label>
          
          <Input 
            type="textarea"
            name="description"
            id="description"
            placeholder="Sem napíšte komentár"/>
            <Button  className="">
            Pridať komentár
           </Button>
          </FormGroup>



          <FormGroup>
            <Label for="description">Komentáre</Label>
            <Input disabled
              type="textarea"
              name="description"
              id="description"
              placeholder="Komentár"/>
          </FormGroup>

        
      </Form>
      <ToastContainer />
    </div>
  );


};

export default QuestionDetailPage;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

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
    <div>
      <h1>{post.title}</h1><br></br>
      <p>{post.text}</p><br></br>
      <p>{post.description}</p><br></br>
      <p>{post.createdAt}</p><br></br>
    </div>
  );
};

export default QuestionDetailPage;
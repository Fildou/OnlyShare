  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import {
  Button,
    Card,
    CardBody,
    CardLink,
    CardSubtitle,
    CardText,
    CardTitle,
  Form,
  FormGroup,
  Input,
  Label
} from "reactstrap";
  import { toast, ToastContainer } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import { useNavigate, useParams, Link } from "react-router-dom";
  import "./QuestionDetailPage.css";
  import { useAuth } from "../middleware/authContext";
  import CommentComponent from "../components/main/comment";
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faComment } from '@fortawesome/free-solid-svg-icons';
  import Swal from 'sweetalert2';

  const QuestionDetailPage = () => {
    const { postId } = useParams();
    const [post, setPost] = useState([]);

    const [comments, setComments] = useState([]);
    const [question, setQuestion] = useState("");
    const [content, setContent] = useState("");
    const [contentError, setContentError] = useState("");
    const navigate = useNavigate();
    const { isLoggedIn, toggleLogin, user } = useAuth();

    const handleSave = async (e) => {
      
      e.preventDefault();

      // setContentError(validateField(content));
      
      if (!isLoggedIn)
      {
        Swal.fire({
          icon: "warning",
          title: 'LOGIN...',
          text: 'You need to be logged in to comment!',
          confirmButtonText: "Log in",
          cancelButtonText: "Cancel",
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
        }).then ((result) => {
          if(result.isConfirmed) {
            navigate("/login");
          }
        });
        return;
      }
      
      if(content){
        try{
          const token = localStorage.getItem("token");
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          };

            const tokenParts = token.split('.');
            const tokenPayload = JSON.parse(atob(tokenParts[1]));

            const userId = tokenPayload.id;

            if(comments.findIndex(c => c.userId === userId) == -1)
            {
              const response = await axios.post(
                "/api/comment/AddComment",
                {content, question},
                config
              );
    
              toast.success("Comment created successfully!");
              setTimeout(() => {
                window.location.reload()
              }, 3000);
            }
            else
            {
              throw new Error
            }
        

        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: 'Oops...',
            text: 'You cannot add more comments',
            confirmButtonColor: '#3085d6',
          })
        }
        }
      };
    

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
      <div  className="container">
        <h2 className="post-text">Post summary</h2>
        <div className="form-create">
          <Form className="mt-2" onSubmit={handleSave}>
            <Card className="card">
              <CardBody className="card-body">
                <div className="">
                  <CardTitle className="d-flex justify-content-between"> <span> {post.title}</span>  <span>{formatDate(post.createdAt)}</span></CardTitle>
                  <CardSubtitle className="mb-2">{post.createdByUserName}</CardSubtitle>
                </div>
                <CardText className="card-text capitalize-text">{post.description}</CardText>
              </CardBody>
            </Card>
              <FormGroup className="mt-5">
              <Label for="content">Your answer <FontAwesomeIcon icon={faComment} /></Label>
              <Input
                  name="content"
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write comment"/>
              {contentError && <div className="error">{contentError}</div>}
              <button type="submit" className="mt-2 btn btn-primary">
                Post your answer
              </button>
            </FormGroup>
          </Form>
        </div>
        <div className="mt-5">
          <h2 className="post-text">Answers</h2>
          {comments.map((comment) =>(
              <CommentComponent
                  title={formatDate(comment.createdAt)}
                  text={comment.content}
                  username={
                    <Link to={`/profile/${comment.userId}`}>
                      {comment.createdByUser}
                    </Link>
                  }
              />
          ))}
        </div>

        <ToastContainer />
      </div>
    );


  };

  export default QuestionDetailPage;


import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import smileyAvatar from '../resources/smiley.png';
import './ProfilePage.css';
import CardComponent from "../components/main/card";
import "./UserQuestion.css";
import "../components/main/card.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import {Link, useNavigate} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Col, Container, Row } from "reactstrap";
import Swal from "sweetalert2";

const ProfilePage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileInfo, setProfileInfo] = useState("");
  const [likePressed, setLikePressed] = useState(false);
  const [dislikePressed, setDislikePressed] = useState(false)
  const [reactions, setReactions] = useState({});;
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {},
        };
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await axios.get(`/api/profile?userId=${userId}`, config);
        console.log("Profile API response:", response);
        setProfile({
          username: response.data.username,
          info: response.data.profileInfo,
          likes: response.data.likes,
          dislikes: response.data.dislikes,
        });
        if (token) {
          setIsOwner(userId === response.data.loggedInUserId);
          setProfileInfo(response.data.profileInfo);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [editing, userId, likePressed, dislikePressed]);

  useEffect(() => {
    const userReaction = reactions[userId];
    if (userReaction) {
      setLikePressed(userReaction === "like");
      setDislikePressed(userReaction === "dislike");
    } else {
      setLikePressed(false);
      setDislikePressed(false);
    }
  }, [userId, reactions]);

  useEffect(() => {
    const savedReactions = localStorage.getItem("reactions");
    if (savedReactions) {
      setReactions(JSON.parse(savedReactions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("reactions", JSON.stringify(reactions));
  }, [reactions]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch("/api/questions/getQuestionsByUserId", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          const data = await response.json();
          setQuestions(data);
        } else {
          // If no token is present, set an empty array for the questions
          setQuestions([]);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchQuestions();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("ProfileInfo", profileInfo);

      await axios.put(`/api/Profile/UpdateProfile/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReaction = async (reaction) => {
    const isLoggedIn = localStorage.getItem("token");

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

    const token = isLoggedIn;
    try {
      await axios.post(
        `/api/profile/AddReaction/${userId}/${reaction}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const newReactions = {
        ...reactions,
      };
  
      const currentReaction = newReactions[userId];
  
      if (currentReaction === reaction) {
        delete newReactions[userId];
        setLikePressed(false);
        setDislikePressed(false);
      } else {
        newReactions[userId] = reaction;
        setLikePressed(reaction === "like");
        setDislikePressed(reaction === "dislike");
      }
  
      setReactions(newReactions);
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };

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

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <div className="profile_content">
        <h1 className="profile_title">{profile.username}</h1>
        <img src={smileyAvatar} alt="Smiley Avatar" className="smiley-avatar" />
        <div className="mt-2 thumbs">
            <p><FontAwesomeIcon className="color-thumb" icon={faThumbsUp} /> <span className="mx-2">{profile.likes}</span></p>
            <p> <FontAwesomeIcon className="color-thumb-dis" icon={faThumbsDown} />  <span className="mx-2">{profile.dislikes}</span></p>
        </div>
        <p className="info_header">Info: </p>
        <div className="profile_info">
          <div
            contentEditable={editing}
            onBlur={(e) => setProfileInfo(e.target.innerText)}
            suppressContentEditableWarning={true}
          >
            {profileInfo}
          </div>
        </div>
        {isOwner && (
          <>
            {!editing && <button className="profile_button edit_button" onClick={() => setEditing(true)}><FontAwesomeIcon icon={faEdit} /> Edit Profile</button>}
            {editing && (
              <>
                <button className="profile_button save_button" onClick={handleUpdateProfile}><FontAwesomeIcon icon={faSave} /> Save</button>
                <button className="profile_button cancel_button" onClick={() => setEditing(false)}><FontAwesomeIcon icon={faTimes} /> Cancel</button>
              </>
            )}
          </>
        )}
        {!isOwner && (
          <div className="reactions">
            <button
              className={`profile_button like_button${likePressed ? " pressed" : ""}`}
              onClick={() => handleReaction("like")}
            >
              <FontAwesomeIcon icon={faThumbsUp} /> Like
            </button>
            <button
              className={`profile_button dislike_button${dislikePressed ? " pressed" : ""}`}
              onClick={() => handleReaction("dislike")}
            >
              <FontAwesomeIcon icon={faThumbsDown} /> Dislike
            </button>
          </div>
        )}
      </div>
      {isOwner && (
        <div>
          <Container>
            <h1 className="posts-heading d-flex">My questions</h1>
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
      )}
    </div>
  );
};

export default ProfilePage;

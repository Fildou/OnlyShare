import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import smileyAvatar from '../resources/smiley.png';
import './ProfilePage.css';

const ProfilePage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileInfo, setProfileInfo] = useState("");
  const [likePressed, setLikePressed] = useState(false);
  const [dislikePressed, setDislikePressed] = useState(false)
  const [reactions, setReactions] = useState({});;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/profile?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Profile API response:", response);
        setProfile({
          username: response.data.username,
          info: response.data.profileInfo,
          likes: response.data.likes,
          dislikes: response.data.dislikes,
        });
        setProfileInfo(response.data.profileInfo);
        setIsOwner(userId === response.data.loggedInUserId);
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
    const token = localStorage.getItem("token");
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

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>{profile.username}</h1>
      <img src={smileyAvatar} alt="Smiley Avatar" className="smiley-avatar" />
      <div>
        <p>Info: {profileInfo}</p>
        {isOwner && (
          <>
            {!editing && <button onClick={() => setEditing(true)}>Edit Profile</button>}
            {editing && (
              <div>
                <label>
                  Update Profile Info:
                  <input
                    type="text"
                    value={profileInfo}
                    onChange={(e) => setProfileInfo(e.target.value)}
                  />
                </label>
                <button onClick={handleUpdateProfile}>Save</button>
                <button onClick={() => setEditing(false)}>Cancel</button>
              </div>
            )}
          </>
        )}
        {!isOwner && (
          <div>
            <button
              className={likePressed ? "pressed" : ""}
              onClick={() => handleReaction("like")}
            >
              Like
            </button>
            <button
              className={dislikePressed ? "pressed" : ""}
              onClick={() => handleReaction("dislike")}
            >
              Dislike
            </button>
          </div>
        )}
        <p>Likes: {profile.likes}</p>
        <p>Dislikes: {profile.dislikes}</p>
      </div>
    </div>
  );
};

export default ProfilePage;

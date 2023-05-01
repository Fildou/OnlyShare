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
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [userReaction, setUserReaction] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/profile?userId=${userId}`);
        console.log("Profile API response:", response);
        setProfile(response.data);
        setProfileInfo(response.data.profileInfo);
        setProfilePictureUrl(response.data.profilePictureUrl);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const checkIsOwner = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const { data } = await axios.get(`/api/Profile/isProfileOwner?userId=${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
            setIsOwner(data);
            console.log('isOwner:', data);
            console.log('userId:', userId);
        } catch (error) {
            console.error("Error checking profile ownership:", error);
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error response headers:", error.response.headers);
        }
    };

    const fetchUserReaction = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const { data } = await axios.get(`/api/profile/userReaction?targetUserId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserReaction(data);
      } catch (error) {
        console.error("Error fetching user reaction:", error);
      }
    };


    fetchProfile();
    checkIsOwner();
    fetchUserReaction();
  }, [userId]);

  const handleUpdateProfile = async () => {
    try {
      await axios.put("/api/Profile", {
        profileInfo,
        profilePictureUrl,
      });
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLikeProfile = async () => {
    try {
      if (userReaction && userReaction.isLike) {
        await handleRemoveReaction();
        setUserReaction(null);
      } else {
        const token = localStorage.getItem("authToken");
        await axios.post(`/api/profile/like?targetUserId=${userId}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserReaction({ isLike: true });
      }
    } catch (error) {
      console.error("Error liking profile:", error);
    }
  };
  
  
  const handleDislikeProfile = async () => {
    try {
      if (userReaction && !userReaction.isLike) {
        await handleRemoveReaction();
        setUserReaction(null);
      } else {
        const token = localStorage.getItem("authToken");
        await axios.post(`/api/profile/dislike?targetUserId=${userId}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserReaction({ isLike: false });
      }
    } catch (error) {
      console.error("Error disliking profile:", error);
    }
  };

  const handleRemoveReaction = async () => {
    try {
      await axios.delete(`/api/profile/reaction?targetUserId=${userId}`);
    } catch (error) {
      console.error("Error removing reaction:", error);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>{profile.username}</h1>
      <img src={smileyAvatar} alt="Smiley Avatar" className="smiley-avatar" />
      <div>
        <p>Info: I could be better implemented</p>
      </div>
        <div className="reaction-buttons">
          <button onClick={handleLikeProfile}>Like</button>
          <button onClick={handleDislikeProfile}>Dislike</button>
        </div>
    </div>
  );
};
export default ProfilePage;
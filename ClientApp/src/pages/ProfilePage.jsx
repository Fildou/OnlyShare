import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileInfo, setProfileInfo] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

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
        } catch (error) {
          console.error("Error checking profile ownership:", error);
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          console.error("Error response headers:", error.response.headers);
        }
      };

    fetchProfile();
    checkIsOwner();
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

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>{profile.username}</h1>
      {editing ? (
        <>
          <textarea
            value={profileInfo}
            onChange={(e) => setProfileInfo(e.target.value)}
          />
          <input
            type="text"
            value={profilePictureUrl}
            onChange={(e) => setProfilePictureUrl(e.target.value)}
          />
          <button onClick={handleUpdateProfile}>Save Changes</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <div>{profile.profileInfo}</div>
          <img src={profile.profilePictureUrl} alt="Profile" />
          {isOwner && <button onClick={() => setEditing(true)}>Edit Profile</button>}
        </>
      )}
    </div>
  );
};

export default ProfilePage;
import React from "react";
import { Col, Row, Card } from "@themesberg/react-bootstrap";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { CircularProgress, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import ProfileCover from "../imgs/clouds.jpg";
import SendIcon from "@mui/icons-material/Send";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";
import PopupPage from "./PopupPage";

const Profile = () => {
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [followersCount, setFollowersCount] = useState("");
  const [followingCount, setFollowingCount] = useState("");
  const [showFollowersDialog, setShowFollowersDialog] = useState(false);
  const [viewOption, setViewOption] = useState("");
  const [loading, setLoading] = useState(true);
  const isUpdated =
    JSON.stringify(profileImage) !== JSON.stringify(imageUrlInput);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await axios.get("/users/userInfo/");
        setId(res.data._id || "");
        setUsername(
          (res.data.name.firstName || "") + " " + (res.data.name.lastName || "")
        );
        let fetchedImageUrl = res.data.image.url || "";
        setProfileImage(fetchedImageUrl);
        setImageUrlInput(fetchedImageUrl);
        setFollowersCount(res.data.followers.length);
        setFollowingCount(res.data.following.length);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [setId, setUsername, setProfileImage, setImageUrlInput]);

  const handleImageUpdate = async () => {
    try {
      // Check if the image exists at the given URL
      const imageExists = await checkImage(imageUrlInput);

      if (!imageExists) {
        toast.error("The image does not exist at the given URL.");
        return; // Exit the function
      }

      await axios.put("/users/userInfo/profileImage", {
        image: { url: imageUrlInput },
      });

      let userData = await axios.get("/users/userInfo");
      let userId = userData.data._id;
      let dataToCards = { image: { url: imageUrlInput } };
      let res = await axios.put(`/cards/my_all_cards/${userId}`, dataToCards);
      if (res.data.dataToCards) {
        console.log("No cards were found for this user");
      }

      setProfileImage(imageUrlInput);
      setImageUrlInput(imageUrlInput);
      toast.success("Profile picture updated successfully");

    } catch (error) {
      console.error("Failed to update profile image:", error);
      toast.error("Failed to update profile image.");
    }
  };

  const checkImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true); // Image loaded successfully
      img.onerror = () => resolve(false); // Image failed to load
      img.src = url;
    });
  };


  const handleFollowersOpen = (option) => {
    setViewOption(option);
    setShowFollowersDialog(true);
  };

  const handleFollowersClose = () => {
    setShowFollowersDialog(false);
  };


  return (
    <>
      <Box sx={{ mt: "10rem" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "25vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Col>
            <Row>
              <Col xs={12}>
                <Card border="light" className="text-center p-0 mb-4">
                  <div
                    style={{ backgroundImage: `url(${ProfileCover})` }}
                    className="profile-cover rounded-top"
                  >
                    <Card.Body className="pb-5">
                      <Card.Img
                        src={profileImage || ""}
                        alt={username}
                        className="user-avatar large-avatar rounded-circle mx-auto mt-n7 mb-4"
                      />
                      <Card.Title style={{ color: "white", fontSize: "28px", fontWeight: "bold" }}>{username}</Card.Title>
                      <br />
                    </Card.Body>
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
        )}

        {!loading && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
                width: 600,
                maxWidth: "100%",
                minHeight: 150,
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{
                  marginRight: "10px",
                  cursor: "pointer",
                  color: "#1E90FF",
                  fontSize: "20px",
                }} onClick={() => handleFollowersOpen("followers")}>{followersCount} Followers</p>
                <p>|</p>
                <p style={{
                  marginLeft: "10px",
                  cursor: "pointer",
                  color: "#1E90FF",
                  fontSize: "20px"
                }} onClick={() => handleFollowersOpen("following")}>{followingCount} Following</p>
              </div>
              <br />
              <br />
              <h5>Update Profile Picture</h5>
              <div
                style={{ display: "flex", width: "100%", alignItems: "center" }}
              >
                <TextField
                  fullWidth
                  label="Image Url"
                  id="fullWidth"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  style={{ marginRight: "10px" }}
                />
                <Button onClick={handleImageUpdate} disabled={!isUpdated}>
                  <SendIcon />
                </Button>
              </div>
            </Box>
          </div>
        )}

        {!loading && (
          <PopupPage
            open={showFollowersDialog}
            handleClose={() => handleFollowersClose()}
            userId={id}
            viewOption={viewOption}
          />
        )}
      </Box>
    </>
  );
};

export default Profile;

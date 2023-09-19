import React, { useState, useEffect } from "react";
import CardComponent from "../components/CardComponent";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Container from "@mui/material/Container";
import { getCardProps } from "../components/CardProps";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const SavedPostsPage = () => {
  const navigate = useNavigate();
  const payload = useSelector((state) => state.authSlice.payload);

  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const response = await axios.get("/cards");
        setSavedPosts(
          response.data.filter((card) => card.likes.includes(payload._id))
        );
      } catch (error) {
        console.error("Error fetching saved posts:", error);
        toast.error("Failed to fetch saved posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, [payload]);

  const fetchUpdatedSavedPosts = async () => {
    try {
      const response = await axios.get("/cards");
      setSavedPosts(
        response.data.filter((card) => card.likes.includes(payload._id))
      );
      setLoading(true);
      navigate(0);
    } catch (error) {
      console.error("Error fetching updated saved posts:", error);
      toast.error("Failed to fetch updated saved posts.");
    }
  };

  const handleShowPosts = () => {
    navigate("/POSTS");
  };

  return (
    <>
      <Container
        sx={{
          p: 2,
        }}
      >
        <Box sx={{ position: "relative" }}>
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
          ) : savedPosts.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                minHeight: "55vh",
                mt: 15,
              }}
            >
              <FavoriteBorderIcon fontSize="large" />
              <Typography
                sx={{
                  mt: 2,
                }}
                variant="h6"
                align="center"
              >
                You haven't liked any post yet
              </Typography>
              <Button
                variant="contained"
                onClick={handleShowPosts}
                size="large"
                sx={{
                  mt: 3,
                  backgroundColor: "#2D2D2D",
                  "&:hover": {
                    backgroundColor: "#000",
                  },
                  borderRadius: "0",
                  height: "43px",
                  width: "270px",
                  fontWeight: "bold",
                }}
              >
                START LIKING
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                  <Card
                    sx={{
                      position: "relative",
                      mt: 2,
                      display: "flex",
                      flexDirection: "row",
                      height: "90%",
                    }}
                  >
                    <CardContent
                      sx={{
                        flex: "1 0 auto",
                      }}
                    >
                      <Typography
                        fontSize="large"
                        sx={{
                          fontWeight: "bold",
                          mt: 1,
                          ml: 2,
                        }}
                      >
                        Saved Posts
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <br />
              {savedPosts.map((item, index) => (
                <CardComponent
                  key={index}
                  currentUserId={payload._id}
                  onHeartClick={fetchUpdatedSavedPosts}
                  {...getCardProps(item, true)}
                />
              ))}
            </>
          )}
        </Box>
      </Container>
    </>
  );
};

export default SavedPostsPage;

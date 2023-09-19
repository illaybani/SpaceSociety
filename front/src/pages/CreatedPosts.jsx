import React, { useState, useEffect } from "react";
import CardComponent from "../components/CardComponent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { IconButton, Box, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import AlertDialog from "../components/AlertDialog";
import { useSelector } from "react-redux";
import Container from "@mui/material/Container";
import { getCardProps } from "../components/CardProps";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddDialog from "../components/AddDialog";
import axios from "axios";

const CreatedPosts = () => {
  const navigate = useNavigate();
  const payload = useSelector((state) => state.authSlice.payload);
  const [savedPosts, setSavedPosts] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/cards/my-cards");
      setSavedPosts(response.data);
    } catch (error) {
      console.error("Error fetching Created posts:", error);
      console.log("Error Details:", error.response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeleteFromInitialPostsArr = async (id) => {
    setPostToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleDialogClose = async (confirmed) => {
    setShowDeleteDialog(false);
    if (confirmed) {
      try {
        await axios.delete(`/cards/card-user/${postToDelete}`);
        setSavedPosts((prevPostsArr) =>
          prevPostsArr.filter((item) => item._id !== postToDelete)
        );
        toast.success("Post deleted successfully");
        navigate(0);
      } catch (err) {
        console.log("error when deleting", err.response.data);
        toast.error("Oops, something went wrong!");
      }
    }
  };

  const handleEditFromInitialPostsArr = (id) => {
    navigate(`/my-posts/${id}`);
  };


  return (
    <>
      <Container>
        <Box sx={{ position: "relative" }}>
          <Box sx={{ mt: 4 }}>
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
                <Typography
                  sx={{
                    mt: 2,
                  }}
                  variant="h6"
                  align="center"
                >
                  No created posts yet
                </Typography>
                <Button
                  onClick={() => setOpen(true)}
                  open={open}
                  variant="contained"
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
                  CREATE POST
                </Button>
                {open && <AddDialog isOpen={open} setOpen={setOpen} />}
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
                          My Posts
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <br />
                {savedPosts.map((item, index) => (
                  <CardComponent
                    key={index}
                    onDelete={() => handleDeleteFromInitialPostsArr(item._id)}
                    onEdit={handleEditFromInitialPostsArr}
                    canEdit={payload && payload._id === item.user_id}
                    canDelete={payload && payload._id === item.user_id}
                    {...getCardProps(item, false)}
                  />
                ))}
              </>
            )}
          </Box>
          <AlertDialog
            open={showDeleteDialog}
            handleConfirm={handleDialogClose}
            handleClose={() => handleDialogClose(false)}
            title="Are you sure you want to delete post?"
            description="This action cannot be undone"
          />
        </Box>
        <br />
        <br />
      </Container>
    </>
  );
};
export default CreatedPosts;

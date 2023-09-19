import React, { useState, useEffect } from "react";
import CardComponent from "../components/CardComponent";
import { IconButton, Box } from "@mui/material";
import { toast } from "react-toastify";
import AlertDialog from "../components/AlertDialog";
import Container from "@mui/material/Container";
import { getCardProps } from "../components/CardProps";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CircularProgress, Typography } from "@mui/material";
import AddDialog from "../components/AddDialog";
import axios from "axios";

const PostsPageContent = (params) => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const response = await axios.get("/cards");
            const filteredPosts = response.data.filter((post) => post.user_id === params.id);
            setSavedPosts(filteredPosts);
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
            } catch (err) {
                console.log("error when deleting", err.response.data);
                toast.error("Oops, something went wrong!");
            }
        }
    };


    return (
        <>
            <Container>
                <Box sx={{ position: "relative" }}>
                    <Box>
                        {loading ? (
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
                                                    {params.firstName} {params.lastName} Posts
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
                                        canDelete={true}
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
export default PostsPageContent;

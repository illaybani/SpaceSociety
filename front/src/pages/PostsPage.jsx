import { Box, CircularProgress, Container } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import CardComponent from "../components/CardComponent";
import { toast } from "react-toastify";
import { getCardProps } from "../components/CardProps";
import Typography from "@mui/material/Typography";
import { useRef } from "react";

const PostsPage = () => {
  const [originalPostsArr, setOriginalPostsArr] = useState(null);
  const [postsArr, setPostsArr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const isMounted = useRef(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/cards");
        const currentUser = await axios.get("users/userInfo");
        setCurrentUser(currentUser.data);
        const filteredCards = response.data.filter(card => currentUser.data.following.includes(card.user_id));

        if (isMounted.current) {
          setOriginalPostsArr(filteredCards);
        }
      } catch (error) {
        console.error(error);
        toast.error("Error getting posts");
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (originalPostsArr) {
      const combined = [...originalPostsArr];
      const postsWithoutDuplicates = Array.from(
        new Set(combined.map((a) => a._id))
      ).map((id) => {
        return combined.find((a) => a._id === id);
      });

      setPostsArr(postsWithoutDuplicates);
    }
  }, [originalPostsArr]);



  return (
    <>
      <Container
        sx={{
          mt: "2rem",
        }}>
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
        ) : postsArr ? (
          postsArr.length > 0 ? (
            postsArr.map((item, index) => (
              <CardComponent
                key={index}
                currentUserId={currentUser._id}
                {...getCardProps(item)}
              />
            ))
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "30vh",
                flexDirection: "column",
                textAlign: "center",
                color: "text.primary",
              }}
            >
              <Typography variant="h5">
                No posts yet
              </Typography>
            </Box>
          )
        ) : null}
      </Container>
    </>
  );
};

export default PostsPage;

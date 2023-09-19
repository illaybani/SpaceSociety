import * as React from "react";
import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Stack from "@mui/material/Stack";
import validateEditSchema, {
  validateEditCardParamsSchema,
} from "../validation/editValidation";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


const EditCardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputsErrorsState, setInputsErrorsState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [inputState, setInputState] = useState({
    user: "",
    description: "",
    uploadTime: "",
    image: { url: "", alt: "" },
    uploadedImage: "",
  });
  const [updateClicked, setUpdateClicked] = useState(false);
  const [initialInputState, setInitialInputState] = useState(inputState);
  const isUpdated =
    JSON.stringify(initialInputState) !== JSON.stringify(inputState);

  const handleReturnClick = () => {
    navigate(-1);
  };

  const handleInputChange = (ev) => {
    if (ev && ev.target) {
      const { id, value } = ev.target;
      setInputState((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const handleInputBlur = (ev) => {
    const { id, value } = ev.target;
    const isFormFilled = Object.values(inputState).every(
      (value) => value !== ""
    );

    setIsFormFilled(isFormFilled);
    const joiResponse = validateEditSchema(inputState);
    setInputsErrorsState((prevState) => ({
      ...prevState,
      [id]: joiResponse ? joiResponse[id] : null,
    }));
  };

  useEffect(() => {
    (async () => {
      try {
        const errors = validateEditCardParamsSchema();
        if (errors) {
          navigate("/");
          return;
        }
        const { data } = await axios.get(`/cards/my-cards/${id}`);
        let newInputState = {
          user: "",
          description: "",
          uploadTime: "",
          image: { url: "", alt: "" },
          uploadedImage: "",
          ...data,
        };
        setInputState(newInputState);

        setInitialInputState(newInputState);
      } catch (error) {
        console.log("error from axios", error);
        toast.error("Connection error");
      }
    })();
  }, [id]);


  const checkImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true); // Image loaded successfully
      img.onerror = () => resolve(false); // Image failed to load
      img.src = url;
    });
  };

  const handleSaveBtnClick = async (ev) => {
    try {
      setUpdateClicked(true);
      const imageExists = await checkImage(inputState.uploadedImage);
      let joiResponse = {};
      if (!imageExists && inputState.uploadedImage !== "") {
        joiResponse.uploadedImage = ["The image does not exist at the given URL"];
      }

      let inputStateWithSelectedValues = {
        ...inputState,
      };
      delete inputStateWithSelectedValues._id;
      delete inputStateWithSelectedValues.createdAt;
      delete inputStateWithSelectedValues.__v;
      delete inputStateWithSelectedValues.image._id;

      joiResponse = {
        ...joiResponse,
        ...validateEditSchema(inputStateWithSelectedValues),
      };
      setInputsErrorsState(joiResponse);
      if (!Object.keys(joiResponse).length) {
        const newCard = { ...inputStateWithSelectedValues };
        const response = await axios.put(`/cards/my-cards/${id}`, newCard);
        if (response.status === 200) {
          toast.success("Post updated successfully");
          navigate(-1);
        } else {
          throw new Error("Failed to update post");
        }
      } else {
        setUpdateClicked(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating post");
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Box sx={{ position: "relative", mt: "4rem" }}>
        <IconButton
          sx={{ position: "absolute", top: 10, left: 10 }}
          onClick={handleReturnClick}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Container
        sx={{
          position: "relative",
          mt: "4rem",
          width: "100%",
          maxWidth: "500px",
          "@media (min-width: 768px)": {
            maxWidth: "700px",
          },
        }}
      >
        <br />
        <Box textAlign="center">
          <h5>Update post</h5>
        </Box>
        <br />
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={inputState.image.url}
            alt={inputState.image.alt || "loading.."}
          />
          <div>
            <Typography variant="subtitle1">
              {inputState.user || "Loading..."}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Host - Your Profile
            </Typography>
          </div>
        </Stack>
        <br />
        <Grid container spacing={2} sx={{ display: "flex", flexWrap: "wrap" }}>
          <Grid item xs={6}></Grid>
        </Grid>
        <TextField
          fullWidth
          id="outlined-multiline-static"
          multiline
          rows={4}
          margin={"normal"}
          label={"Post"}
          placeholder={"Write Something..."}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            maxLength: 300,
          }}
          value={inputState.description}
          onChange={(event) => {
            setInputState({
              ...inputState,
              description: event.target.value,
            });
            handleInputChange();
          }}
          onBlur={handleInputBlur}
        />
        {inputsErrorsState && inputsErrorsState.description && (
          <Alert severity="warning">
            {inputsErrorsState.description.map((item) => (
              <div key={"description-errors-" + item}>{item}</div>
            ))}
          </Alert>
        )}
        <TextField
          fullWidth
          label={"Image"}
          placeholder={"Image Url(Optional)"}
          id="fullWidth"
          value={inputState.uploadedImage}
          margin={"normal"}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(event) => {
            setInputState({
              ...inputState,
              uploadedImage: event.target.value,
            });
            handleInputChange();
          }}
          style={{ marginTop: "10px" }}
          onBlur={handleInputBlur}
        />
        {inputsErrorsState && inputsErrorsState.uploadedImage && (
          <Alert severity="warning">
            {inputsErrorsState.uploadedImage.map((item) => (
              <div key={"uploadedImage-errors-" + item}>{item}</div>
            ))}
          </Alert>
        )}
        <Box sx={{ textAlign: "center" }}>
          <Button
            sx={{ marginTop: "2rem" }}
            onClick={handleSaveBtnClick}
            variant={"contained"}
            color={"primary"}
            disabled={!isUpdated || updateClicked}
          >
            Update
          </Button>
        </Box>
      </Container>
      <br />
      <br />
      <br />
      <br />
    </>
  );
};
export default EditCardPage;

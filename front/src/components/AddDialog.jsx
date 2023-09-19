import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Avatar, Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import {
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import validateAddSchema from "../validation/addValidation";
import axios from "axios";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cardsSliceActions } from "../store/cardsSlice";
import { useRef } from "react";
import ROUTES from "../routes/ROUTES";

export default function AddDialog({ isOpen, setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [inputsErrorsState, setInputsErrorsState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [cardCount, setCardCount] = useState(0);
  const isMountedRef = useRef(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [inputState, setInputState] = useState({
    index: cardCount,
    user: "",
    description: "",
    uploadTime: "",
    image: { url: "", alt: "" },
    uploadedImage: "",
  });


  const checkImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true); // Image loaded successfully
      img.onerror = () => resolve(false); // Image failed to load
      img.src = url;
    });
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("/users/userInfo/");
        const { name, image } = response.data;
        const userName = `${name.firstName || ""} ${name.lastName || ""}`;
        const imageUrl = image.url || "";
        const imageAlt = image.alt || "";

        if (isMountedRef.current) {
          setInputState((prevState) => ({
            ...prevState,
            user: userName,
            image: { url: imageUrl, alt: imageAlt },
          }));
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Connection error");
      }
    };

    fetchUserInfo();

    return () => {
      isMountedRef.current = false;
    };
  }, [setInputState]);

  useEffect(() => {
    setInputState((prevState) => ({ ...prevState, index: cardCount }));
  }, [cardCount]);

  const getCardCount = async () => {
    try {
      const res = await axios.get("/cards/count");
      return res.data.count;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchCardCount = async () => {
      const count = await getCardCount();
      if (isMounted) {
        setCardCount(count);
      }
    };

    fetchCardCount();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (cardCount !== null) {
      setInputState((prevState) => ({
        ...prevState,
        index: cardCount + 1,
      }));
    }
  }, [cardCount]);

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
    const joiResponse = validateAddSchema(inputState);
    setInputsErrorsState((prevState) => ({
      ...prevState,
      [id]: joiResponse ? joiResponse[id] : null,
    }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const scroll = "paper";

  const handleSaveBtnClick = async (ev) => {
    setIsButtonDisabled(true);
    isMountedRef.current = true;
    try {
      const response = await axios.get("/users/userInfo/");
      const imageExists = await checkImage(inputState.uploadedImage);
      let joiResponse = {};
      if (!imageExists && inputState.uploadedImage !== "") {
        joiResponse.uploadedImage = ["The image does not exist at the given URL"];
      }

      let inputStateWithSelectedValues = {
        ...inputState,
        uploadTime: new Date().toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };

      joiResponse = {
        ...joiResponse,
        ...validateAddSchema(inputStateWithSelectedValues),
      };
      setInputsErrorsState(joiResponse);
      if (!Object.keys(joiResponse).length) {
        const newCard = { ...inputStateWithSelectedValues };
        const response = await axios.post(`/cards`, newCard);
        const createdCard = response.data;
        newCard._id = createdCard._id;

        if (isMountedRef.current) {
          dispatch(cardsSliceActions.addCard(newCard));
        }
        toast.success("Your Post Was Posted Successfully");
        handleClose();
        setCardCount((prevCount) => prevCount + 1);
        navigate(ROUTES.HOME);
      } else {
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error posting item");
    } finally {
      isMountedRef.current = false;
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle sx={{ textAlign: "center" }}>New Post</DialogTitle>
      <DialogContent dividers={scroll === "paper"}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={inputState.image.url || ""} />
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

        <DialogContentText id="scroll-dialog-description" component="div">
          <Grid
            container
            spacing={2}
            sx={{ display: "flex", flexWrap: "wrap" }}
          >
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
        </DialogContentText>
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
          onBlur={handleInputBlur}
          style={{ marginTop: "10px" }}
        />
        {inputsErrorsState && inputsErrorsState.uploadedImage && (
          <Alert severity="warning">
            {inputsErrorsState.uploadedImage.map((item) => (
              <div key={"uploadedImage-errors-" + item}>{item}</div>
            ))}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSaveBtnClick}
          variant={"contained"}
          color={"primary"}
          disabled={isButtonDisabled}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

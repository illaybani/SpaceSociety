import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { toast } from "react-toastify";
import Paper from "@mui/material/Paper";

import { CircularProgress } from "@mui/material";

import validateRegisterSchema from "../validation/registerValidation";
import ROUTES from "../routes/ROUTES";

const RegisterPage = () => {
  const [inputState, setInputState] = useState({
    name: { firstName: "", lastName: "" },
    email: "",
    password: "",
  });
  const [inputsErrorsState, setInputsErrorsState] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (ev) => {
    let newInputState = { ...inputState };
    if (ev.target.id === "firstName" || ev.target.id === "lastName") {
      newInputState.name = {
        ...newInputState.name,
        [ev.target.id]: ev.target.value,
      };
    } else {
      newInputState[ev.target.id] = ev.target.value;
    }
    setInputState(newInputState);
  };

  const handleBtnClick = async (ev) => {
    try {
      const joiResponse = validateRegisterSchema(inputState);
      if (joiResponse) {
        const reformedErrors = {
          name: {
            firstName: joiResponse.firstName,
            lastName: joiResponse.lastName,
          },
          email: joiResponse.email,
          password: joiResponse.password,
        };
        setInputsErrorsState(reformedErrors);
        return;
      }

      setLoading(true);

      await axios.post("/users/register", {
        name: {
          firstName: inputState.name.firstName,
          lastName: inputState.name.lastName,
        },
        email: inputState.email,
        password: inputState.password,
      });

      setTimeout(() => {
        setLoading(false);
        navigate(ROUTES.LOGIN);
        toast.success("User Created");
      }, 1000);
    } catch (err) {
      setLoading(false);
      console.log("error from axios", err.response.data);
      err.response.data.msg ? toast.error("Email already exists") : toast.error("Connection error");
    }
  };

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#F5F5F5",
        }}
      >
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 4,
            borderRadius: 2,
            bgcolor: "white",
            maxWidth: "500px",
            marginTop: "20px",
            margin: "auto",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
            onSubmit={(ev) => {
              ev.preventDefault();
              handleBtnClick();
            }}
          >
            <br />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={inputState.name.firstName}
                  onChange={handleInputChange}
                />
                {inputsErrorsState &&
                  inputsErrorsState.name &&
                  inputsErrorsState.name.firstName && (
                    <Alert severity="warning">
                      {inputsErrorsState.name.firstName.map((item) => (
                        <div key={"firstName-errors" + item}>{item}</div>
                      ))}
                    </Alert>
                  )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={inputState.name.lastName}
                  onChange={handleInputChange}
                />
                {inputsErrorsState &&
                  inputsErrorsState.name &&
                  inputsErrorsState.name.lastName && (
                    <Alert severity="warning">
                      {inputsErrorsState.name.lastName.map((item) => (
                        <div key={"lastName-errors" + item}>{item}</div>
                      ))}
                    </Alert>
                  )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={inputState.email}
                  onChange={handleInputChange}
                />
                {inputsErrorsState && inputsErrorsState.email && (
                  <Alert severity="warning">
                    {inputsErrorsState.email.map((item) => (
                      <div key={"email-errors" + item}>{item}</div>
                    ))}
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={inputState.password}
                  onChange={handleInputChange}
                />
                {inputsErrorsState && inputsErrorsState.password && (
                  <Alert severity="warning">
                    {inputsErrorsState.password.map((item) => (
                      <div key={"password-errors" + item}>{item}</div>
                    ))}
                  </Alert>
                )}
              </Grid>
            </Grid>
            <Grid container justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 1,
                  height: 36,
                  padding: "4px 16px",
                  backgroundColor: "primary.main",
                  "&:hover": {
                    backgroundColor: "#7C3A61",
                  },
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Sign Up"}
              </Button>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </>
  );
};
export default RegisterPage;

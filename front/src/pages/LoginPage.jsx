import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import ROUTES from "../routes/ROUTES";
import validateLoginSchema from "../validation/loginValidation";
import useLoggedIn from "../hooks/useLoggedIn";
import Checkbox from "@mui/material/Checkbox";
import Cookies from "js-cookie";

const LoginPage = () => {
  const [inputState, setInputState] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [inputsErrorsState, setInputsErrorsState] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const loggedIn = useLoggedIn();

  const handleBtnClick = async (ev) => {
    try {
      const dataToValidate = {
        email: inputState.email,
        password: inputState.password,
      };
      const joiResponse = validateLoginSchema(dataToValidate);
      setInputsErrorsState(joiResponse);
      if (joiResponse) {
        return;
      }
      setLoading(true);

      const { data } = await axios.post("/users/login", dataToValidate);
      setTimeout(() => {
        setLoading(false);
        localStorage.setItem("token", data.token);
        const expirationTime = inputState.rememberMe ? 10 : 1 / 48;
        Cookies.set("token", data.token, { expires: expirationTime });
        loggedIn();
        navigate(ROUTES.HOME);
        toast.success("Login success");
      }, 1000);
      const date = new Date();
      const dataToLastLoginTime = {
        id: data.user._id,
        lastLoginTime: date
      }
      await axios.patch("/users/userLastLoginTime", dataToLastLoginTime);
    } catch (err) {
      setLoading(false);
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 400)
      ) {
        setInputState({ ...inputState, password: "" });
        toast.error("Wrong email or password");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleInputChange = (ev) => {
    const { id, value, type, checked } = ev.target;
    const newValue = type === "checkbox" ? checked : value;

    setInputState((prevState) => ({
      ...prevState,
      [id]: newValue,
    }));
  };

  return (
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
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LoginIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
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
            <Grid item xs={12} sx={{ position: 'relative' }}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                inputProps={{ maxLength: 25 }}
                autoComplete="new-password"
                value={inputState.password}
                onChange={handleInputChange}
              />

              {inputsErrorsState && inputsErrorsState.password && (
                <Box sx={{ position: 'absolute', top: '100%', left: "1rem", right: 0, zIndex: 1, }}>
                  <Alert severity="warning">
                    {inputsErrorsState.password.map((item) => (
                      <div key={"password-errors" + item}>{item}</div>
                    ))}
                  </Alert>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center", mt: "3rem" }}>
              <Checkbox
                id="rememberMe"
                checked={inputState.rememberMe}
                onChange={handleInputChange}
              />
              <Typography variant="body2">Remember Me</Typography>
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
              {loading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;

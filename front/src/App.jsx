import React from "react";
import { useEffect, useState } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  CircularProgress,
} from "@mui/material";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Router from "./routes/Router";
import { useSelector } from "react-redux";
import useLoggedIn from "./hooks/useLoggedIn";
import AddButton from "./components/AddButton";
import TopNavBar from "./components/Navbar/TopNavbar";
import SideBar from "./components/Navbar/SideBar";
import AddDialog from "./components/AddDialog";

const light = {
  palette: {
    mode: "light",
    background: {
      default: "#EEEEEE",
    },
  },
};


function App() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const loggedIn = useLoggedIn();
  const [mobileOpen, setMobileOpen] = useState(false);
  const payload = useSelector((state) => state.authSlice.payload);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    (async () => {
      await loggedIn();
      setIsLoading(false);
    })();
  }, []);


  return (
    <ThemeProvider theme={createTheme(light)}>
      <CssBaseline />
      <ToastContainer
        position="bottom-center"
        autoClose={800}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="light"
      />
      <header>
        <TopNavBar handleDrawerToggle={handleDrawerToggle} />
        <SideBar handleDrawerToggle={handleDrawerToggle} />
      </header>
      <main
        style={{
          flexGrow: 1,
        }}
      >
        {isLoading ? <CircularProgress /> : <Router />}
      </main>
      {payload && (
        <AddButton handleClick={() => setOpen(true)} open={open} />
      )}{" "}
      {open && <AddDialog isOpen={open} setOpen={setOpen} />}{" "}
    </ThemeProvider>
  );
}

export default App;

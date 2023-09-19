import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from '@mui/icons-material/Logout';
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import LabelBottomNavigation from "./BottomNavbar";
import TopNavBar from "./TopNavbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { pages, notAuthPages, authedPages, adminPages } from "../pages";
import { authActions } from "../../store/auth";
import AlertDialog from "../AlertDialog";
import { toast } from "react-toastify";
import { CircularProgress } from "@material-ui/core";
import ROUTES from "../../routes/ROUTES";


function SideBar(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogOutDialog, setShowLogOutDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const isLoggedIn = useSelector(
    (bigPieBigState) => bigPieBigState.authSlice.isLoggedIn
  );
  const isAdmin = useSelector(
    (bigPieBigState) => bigPieBigState.authSlice.payload?.isAdmin
  );


  const drawerWidth = 268;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pageChanged, setPageChanged] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const logoutClick = async () => {
    setShowLogOutDialog(true);
  };

  const handleDialogClose = async (confirmed) => {
    setShowLogOutDialog(false);
    if (confirmed) {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));
        dispatch(authActions.logout());
        localStorage.clear();
        drawerOpen && setDrawerOpen(false);
        navigate("/");
        toast.success("You have been logged out");
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const closeDrawer = () => {
      if (drawerOpen) {
        const delay = new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 100);
        });
        delay.then(() => {
          setDrawerOpen(false);
        });
      }
    };

    if ((pageChanged && windowWidth < 960) || windowWidth >= 960) {
      closeDrawer();
      setPageChanged(false);
    }
  }, [pageChanged, drawerOpen, windowWidth]);

  const drawer = (
    <Box
      sx={{
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          height: 60,
          display: "flex",
          pr: 9,
          pb: 1,
          alignItems: "flex-end",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ textAlign: "center", width: "100%" }}
        >
          SpaceSociety
        </Typography>
      </Box>

      <Toolbar />
      <Divider />
      <List>
        {/* Render the navigation items for all users */}
        {pages.map(({ url, label, icon }, index) => (
          <ListItemButton
            key={index}
            onClick={() => {
              navigate(url);
              setPageChanged(true);
            }}
          >
            <ListItemIcon sx={{ color: "black" }}>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
        {/* Render the navigation items for logged out users */}
        {!isLoggedIn &&
          notAuthPages.map(({ url, label, icon }, index) => (
            <ListItemButton
              key={index}
              onClick={() => {
                navigate(url);
                setPageChanged(true);
              }}
            >
              <ListItemIcon sx={{ color: "black" }}>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        {/* Render the navigation items for logged in users */}
        {isLoggedIn &&
          authedPages.map(({ url, label, icon }, index) => {
            if (url === ROUTES.LOGOUT) {
              return (
                <ListItemButton key={index} onClick={logoutClick}>
                  <ListItemIcon sx={{ color: "black" }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Log out" />
                </ListItemButton>
              );
            } else {
              return (
                <ListItemButton
                  key={index}
                  onClick={() => {
                    navigate(url);
                    setPageChanged(true);
                  }}
                >
                  <ListItemIcon sx={{ color: "black" }}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={label} />
                  {url === ROUTES.CREATE && <ListItem></ListItem>}
                </ListItemButton>
              );
            }
          })}
        {/* Render the navigation items for admin */}
        {isAdmin &&
          adminPages.map(({ url, label, icon }, index) => (
            <ListItemButton
              key={index}
              onClick={() => {
                navigate(url);
                setPageChanged(true);
              }}
            >
              <ListItemIcon sx={{ color: "black" }}>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
      </List>
      <Divider />
    </Box>
  );

  const container =
    props.window !== undefined ? () => props.window.document.body : undefined;

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            container={container}
            open={drawerOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { md: "block", sm: "none", xs: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box>
          <TopNavBar handleDrawerToggle={handleDrawerToggle} />
        </Box>
      </Box>
      <Box sx={{ display: { sm: "flex", md: "none" } }}>
        <LabelBottomNavigation />
      </Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <AlertDialog
          open={showLogOutDialog}
          handleConfirm={handleDialogClose}
          handleClose={() => handleDialogClose(false)}
          title="Are you sure you want to log out?"
          description="Your session will be closed"
        />
      )}
    </>
  );
}

export default SideBar;

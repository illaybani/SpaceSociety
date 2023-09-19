import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import ROUTES from "../../routes/ROUTES";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

export default function LabelBottomNavigation() {
  const [value, setValue] = useState(ROUTES.HOME);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setValue(location.pathname);
  }, [location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
  };

  const bottomNavPages = [
    {
      key: "home",
      value: ROUTES.HOME,
      icon: <HomeOutlinedIcon />,
    },
    {
      key: "posts",
      value: ROUTES.POSTS,
      icon: <FeedOutlinedIcon />,
    },
    {
      key: "myPosts",
      value: ROUTES.MYPOSTS,
      icon: <HistoryToggleOffIcon />,
    },
    {
      key: "profile",
      value: ROUTES.PROFILE,
      icon: <AccountCircleOutlinedIcon />,
    },
  ];

  return (
    <>
      <Box sx={{ height: 55 }}>
        <Divider sx={{ border: "0.1vh solid grey" }} />
        <BottomNavigation
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10 }}
          value={value}
          onChange={handleChange}
        >
          {bottomNavPages.map((page) => (
            <BottomNavigationAction
              sx={{
                color: "black",
                "& .MuiSvgIcon-root": {
                  fontSize: "1.7rem",
                  fill: "black",
                },
              }}
              key={page.key}
              value={page.value}
              icon={page.icon}
            />
          ))}
        </BottomNavigation>
      </Box>
    </>
  );
}

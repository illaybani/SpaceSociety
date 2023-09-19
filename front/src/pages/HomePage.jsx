import React from "react";
import spaceImage from "../imgs/spaceHomePage.jpg";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import { Button } from "@mui/material";

function HomePage() {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/Posts");
  };
  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100vh",
          padding: "15rem 0",
          background: `
      linear-gradient(to bottom,
        rgba(0, 0, 0, 0.7) 0%,
        rgba(0, 0, 0, 0.3) 75%,
        rgba(0, 0, 0, 1) 100%
      ),
      url(${spaceImage})`,
          backgroundPosition: "top left",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "scroll",
          backgroundSize: "100% 100%",
        }}
      >
        <div className="container px-4 px-lg-5 d-flex h-100 align-items-center justify-content-center">
          <div className="d-flex justify-content-center">
            <div className="text-center">
              <h1 className="mx-auto my-0 text-white">SpaceSociety</h1>
              <h2 className="text-white-50 mx-auto mt-2 mb-5">
                Connect With Your Space Friends
              </h2>
              <Button
                id="get-started-btn"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#008080",
                  color: "#fff",
                  fontSize: "0.8rem",
                  padding: "0.8rem 1.8rem",
                }}
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
}

export default HomePage;

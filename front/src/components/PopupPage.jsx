import * as React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import FollowersPageContent from "./FollowersContent";
import PostsPageContent from "./PostsContent";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({ open, handleClose, userId, firstName, lastName, viewOption }) {
    let pageHeader = React.createRef();

    useEffect(() => {
        if (window.innerWidth > 991) {
            const updateScroll = () => {
                let windowScrollTop = window.pageYOffset / 3;
                pageHeader.current.style.transform =
                    "translate3d(0," + windowScrollTop + "px,0)";
            };
            window.addEventListener("scroll", updateScroll);
            return function cleanup() {
                window.removeEventListener("scroll", updateScroll);
            };
        }
    });

    return (
        <>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: "relative" }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon sx={{ color: "#fff" }} />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <br />
                {viewOption === "followers" && (
                    <FollowersPageContent userId={userId} isFollowers={true} />
                )}
                {viewOption === "following" && (
                    <FollowersPageContent userId={userId} isFollowers={false} />
                )}
                {viewOption === "admin" && (
                    <PostsPageContent id={userId} firstName={firstName} lastName={lastName} />
                )}
            </Dialog>
        </>
    );
}

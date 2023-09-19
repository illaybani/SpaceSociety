import ROUTES from "../../src/routes/ROUTES";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SatelliteAltOutlinedIcon from '@mui/icons-material/SatelliteAltOutlined';
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FeedIcon from '@mui/icons-material/Feed';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from "@mui/icons-material/Lock";


// access to all
export const pages = [
    {
        label: "Home",
        url: ROUTES.HOME,
        icon: <HomeIcon />,
    },

];

// admin
export const adminPages = [
    {
        label: "CRM",
        url: ROUTES.CRM,
        icon: <LockIcon />,
    },

];

//not logged in users
export const notAuthPages = [
    {
        label: "Log in",
        url: ROUTES.LOGIN,
        icon: <ArrowCircleRightIcon />,

    },
    {
        label: "Register",
        url: ROUTES.REGISTER,
        icon: <PersonAddAltIcon />,

    },
];

//logged in users
export const authedPages = [
    {
        label: "Search People",
        url: ROUTES.SEARCH,
        icon: <PersonAddIcon />,

    },
    {
        label: "Posts",
        url: ROUTES.POSTS,
        icon: <FeedIcon />,

    },
    {
        label: "Posts I've Liked",
        url: ROUTES.SAVEDPOSTS,
        icon: <FavoriteBorderIcon />,
    },
    {
        label: "My Posts",
        url: ROUTES.MYPOSTS,
        icon: <HistoryToggleOffIcon />,
    },
    {
        label: "My Profile",
        url: ROUTES.PROFILE,
        icon: <AccountCircleIcon />,
    },
    {
        label: "Edit My Info",
        url: ROUTES.EDITINFO,
        icon: <EditIcon />,
    },
    {
        label: "Explore Planets",
        url: ROUTES.PLANETS,
        icon: <StarBorderIcon />,
    },
    {
        label: "Explore James Webb",
        url: ROUTES.JAMESWEBB,
        icon: <SatelliteAltOutlinedIcon />,
    },
    {
        label: "Logout",
        url: ROUTES.LOGOUT,
        icon: <EditIcon />,
    },
];


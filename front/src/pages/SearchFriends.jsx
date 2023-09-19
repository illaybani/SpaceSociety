import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Switch from "@mui/material/Switch";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import AlertDialog from "../components/AlertDialog";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ROUTES from "../routes/ROUTES";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import { useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "./searchfriends.css";

function SearchFriends() {
    const [users, setUsers] = useState([]);
    const [initialUsers, setInitialUsers] = useState([]);
    const [followAction, setFollowAction] = useState(false);
    const [loading, setLoading] = useState(true);
    const payload = useSelector((state) => state.authSlice.payload);

    const columns = [
        {
            field: "image",
            headerName: "Image",
            width: 110,
            filterable: false,
            renderCell: (params) => (
                <Avatar alt={params.row.name.firstName} src={params.value} />
            ),
        },
        { field: "firstName", headerName: "First name", width: 150 },
        { field: "lastName", headerName: "Last name", width: 150 },
        {
            field: "follow",
            headerName: "Follow User",
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton
                    onClick={() =>
                        handleFollow(params.id, params.row.firstName, params.row.lastName)
                    }
                    style={{ color: params.row.isFollowed ? "blue" : "inherit" }}
                >
                    {params.row.isFollowed ? <PersonIcon /> : <PersonAddIcon />}
                </IconButton>
            ),
        },
    ];

    const filteredUsers = users.filter((user) => user.id !== payload._id);
    const userId = useMemo(() => payload._id, [payload._id]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/users");
                const formattedUsers = response.data.users.map((user) => ({
                    ...user,
                    id: user._id,
                    firstName: user.name.firstName,
                    lastName: user.name.lastName,
                    image: user.image.url,
                    isFollowed: user.followers.includes(userId),
                }));
                setUsers(formattedUsers);
                setInitialUsers(formattedUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to fetch users.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [followAction]);

    const handleFollow = async (id, firstName, lastName) => {
        try {
            const response = await axios.patch(`/users/userInfo/${id}`);
            const isFollowed = response.data.isFollowed;

            if (isFollowed) {
                toast.success(`You Have Followed ${firstName} ${lastName}`);
            } else {
                toast.info(`You Have Unfollowed ${firstName} ${lastName}`);
            }

            setFollowAction((prevFollowAction) => !prevFollowAction);
        } catch (err) {
            console.log("Error when trying to follow/unfollow:", err.response.data);
            toast.error("Oops, something went wrong!");
        }
    };

    return (
        <Container>
            <br />
            <Box height="70vh" width="50%">
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <div style={{ height: "100%", width: "100%" }}>
                        <DataGrid
                            rows={filteredUsers}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            autoPageSize={true}
                            checkboxSelection={false}
                            disableSelectionOnClick={true}
                            hideFooterSelectedRowCount
                            hideFooterRowCount
                        />
                    </div>
                )}
            </Box>
            <br />
        </Container>
    );
}

export default SearchFriends;

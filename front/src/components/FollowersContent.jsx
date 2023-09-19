import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import "../pages/searchfriends.css";

const FollowersPageContent = ({ userId, isFollowers }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

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
        { field: "lastName", headerName: "Last name", width: 135 },
    ];

    const filteredUsers = isFollowers ? users.filter((user) => user.following.includes(userId)) : users.filter((user) => user.followers.includes(userId))

    useEffect(() => {
        axios.get("/users").then((response) => {
            const formattedUsers = response.data.users.map((user) => ({
                ...user,
                id: user._id,
                firstName: user.name.firstName,
                lastName: user.name.lastName,
                image: user.image.url,
                followers: user.followers,
                following: user.following,
            }));

            setUsers(formattedUsers);
        })
            .catch((error) => {
                console.error("Error fetching users:", error);
                toast.error("Failed to fetch users.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);


    return (
        <Container>
            <Box height="70vh" width="40%">
                <h3 style={{ marginBottom: "20px" }}>
                    {isFollowers ? "Followers" : "Following"}
                </h3>
                <div style={{ height: "100%", width: "100%" }}>
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
                            hideFooterPagination={true}
                            hideFooter={true}
                        />
                    )}
                </div>
            </Box>
        </Container>
    );
}

export default FollowersPageContent;

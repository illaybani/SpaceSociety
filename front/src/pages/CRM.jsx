import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AlertDialog from "../components/AlertDialog";
import { toast } from "react-toastify";
import PopupPage from "../components/PopupPage";
import CircularProgress from "@mui/material/CircularProgress";

function CRM() {
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [initialUsers, setInitialUsers] = useState([]);
  const [showPostsDialog, setShowPostsDialog] = useState(false);
  const [inputState, setInputState] = useState({
    user_id: "",
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => {
    const dateObject = new Date(date);
    return dateObject.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <Avatar alt={params.row.name.firstName} src={params.value} />
      ),
    },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "Posts",
      headerName: "Posts",
      width: 100,
      renderCell: (params) => (
        <p
          style={{
            color: "blue",
            textDecoration: "underline",
            cursor: "pointer",
            marginTop: "15px",
          }}
          onClick={() =>
            handlePostsOpen(
              params.id,
              params.row.name.firstName,
              params.row.name.lastName
            )
          }
        >
          View
        </p>
      ),
    },
    {
      field: "lastLoginTime",
      headerName: "Last login time",
      width: 180,
      valueFormatter: (params) => {
        return params.value ? formatDate(params.value) : "";
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDelete(params.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    axios.get("/users").then((response) => {
      const formattedUsers = response.data.users
        .filter(user => user.email !== "admin@gmail.com")
        .map((user) => ({
          ...user,
          id: user._id,
          firstName: user.name.firstName,
          lastName: user.name.lastName,
          image: user.image.url,
          lastLoginTime: user.lastLoginTime,
        }));

      setUsers(formattedUsers);
      setInitialUsers(formattedUsers);
      setUserCount(response.data.userCount - 1);
    }).catch((error) => {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }).finally(() => {
      setLoading(false);
    });
  }, []);


  const handleDelete = (id) => {
    setShowDeleteDialog(true);
    setUserIdToDelete(id);
  };

  const handleDialogClose = async (confirmed) => {
    setShowDeleteDialog(false);
    if (confirmed) {
      try {
        const response = await axios.get("/cards");
        const filteredPosts = response.data.filter(
          (post) => post.user_id === userIdToDelete
        );

        const deletePromises = filteredPosts.map(post =>
          axios.delete(`/cards/card-user/${post._id}`)
        );

        await Promise.all(deletePromises);

        await axios.put(`/users/updateFollowersAndFollowing/${userIdToDelete}`);
        await axios.delete(`/users/${userIdToDelete}`);
        toast.success("User deleted successfully");
        setUsers(users.filter((user) => user.id !== userIdToDelete));
        setUserCount(userCount - 1);
      } catch (err) {
        toast.error(
          err.response?.data?.msg ||
          "Unexpected error occurred while deleting user"
        );
      }
    }
    setUserIdToDelete(null);
  };

  const handlePostsOpen = (id, firstName, lastName) => {
    setInputState({
      user_id: id,
      firstName: firstName,
      lastName: lastName,
    });
    setShowPostsDialog(true);
  };

  const handlePostsClose = () => {
    setShowPostsDialog(false);
  };

  return (
    <Container>
      <br />
      <Box height="70vh" width="100%">
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
              rows={users}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              autoPageSize={true}
              checkboxSelection={false}
              disableSelectionOnClick={true}
              hideFooterSelectedRowCount
            />
            <h5>Total Users: {userCount}</h5>
          </div>
        )}
      </Box>
      <br />
      <AlertDialog
        open={showDeleteDialog}
        handleConfirm={() => handleDialogClose(true)}
        handleClose={() => handleDialogClose(false)}
        title="Are you sure you want to delete this user?"
        description="This action cannot be undone."
      />
      <PopupPage
        open={showPostsDialog}
        handleClose={() => handlePostsClose()}
        userId={inputState.user_id}
        firstName={inputState.firstName}
        lastName={inputState.lastName}
        viewOption={"admin"}
      />
    </Container>
  );
}

export default CRM;

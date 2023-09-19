import React from "react";
import "./cardcomponent.css";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import reveal from "../utils/reveal.js";
import { useState, useEffect } from "react";
import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { toast } from "react-toastify";

const CardComponent = ({
  id,
  user,
  description,
  uploadTime,
  image: { url = "", alt = "" } = {},
  uploadedImage,
  likes,
  currentUserId,
  onHeartClick,
  onDelete,
  onEdit,
  canEdit,
  canDelete,
  index,
  showHeartButton,
}) => {
  const [isLiked, setIsLiked] = useState(
    likes ? likes.includes(currentUserId) : false
  );

  const [likesCount, setLikesCount] = useState(likes.length);

  const handleDeleteBtnClick = () => {
    onDelete(id);
  };

  const handleEditBtnClick = () => {
    onEdit(id);
  };

  const handleHeartBtnClick = async () => {
    try {
      const response = await axios.patch(`/cards/card-like/${id}`);
      const { isLiked: updatedLikedStatus } = response.data;

      if (updatedLikedStatus) {
        toast.success("Post Saved");
      } else {
        toast.info("Saved Post Removed");
      }

      setIsLiked(updatedLikedStatus);
      setLikesCount(response.data.card.likes.length);
      if (onHeartClick) {
        onHeartClick();
      }

    } catch (error) {
      console.log("Error updating card like:", error.message);
      toast.error("Connection error");
    }
  };

  useEffect(() => {
    reveal(index);
  }, [index]);


  const revealClass = index >= 3 ? "reveal" : "";


  return (
    <div className={"post-item p-4 mb-4 bg-white" + revealClass}>
      {showHeartButton && (
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className={"items-link text-primary me-2"}
            id={`postListHeartBtn-${id}`}
            onClick={handleHeartBtnClick}
          >
            <FavoriteIcon
              color={isLiked ? "error" : "disabled"}
              fontSize="medium"
            />
          </button>
        </div>
      )}
      <div className="d-flex align-items-center">
        <div
          className="image-container flex-shrink-0 img-fluid me-2"
          style={{
            width: "46px",
            height: "46px",
            marginBottom: "2rem",
          }}
        >
          <img
            src={url || "loading"}
            alt={alt || "loading"}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
            }}
          />
        </div>
        <div className="d-flex flex-column">
          <div className="d-flex align-items-center">
            <h6
              style={{
                fontSize: "0.9rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              {user}
            </h6>
            <span
              style={{
                marginLeft: "0.5rem",
                marginBottom: "1rem",
                fontSize: "0.9rem",
              }}
            >
              &bull;
            </span>
            <div style={{ marginLeft: "0.6rem", marginBottom: "1.15rem" }}>
              <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                {uploadTime}
              </small>
            </div>
          </div>

        </div>
      </div>
      <div
        className="row g-3"
        style={{
          marginLeft: "2rem",
        }}
      >
        <div className="col-12 col-md-8 d-flex align-items-center mb-5">
          <div className="text-start">
            <div>
              <p className="mb-0">{description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card-bottom d-flex justify-content-between">
        <div className="admin-buttons">
          {canEdit && (
            <Tooltip title="Edit">
              <IconButton sx={{ color: "black" }} onClick={handleEditBtnClick}>
                <ModeEditIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
        <div className="admin-buttons">
          {canDelete && (
            <Tooltip title="Delete">
              <IconButton
                sx={{ color: "black" }}
                onClick={handleDeleteBtnClick}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
      {uploadedImage && (
        <div className="text-start">
          <div>
            <img src={uploadedImage} alt="" className="uploaded-image" />
          </div>
        </div>
      )}
      <br />
      <div style={{ fontSize: "14px", textAlign: "left", marginLeft: "2rem" }}>
        {likesCount} likes
      </div>
    </div>
  );
};

export default CardComponent;

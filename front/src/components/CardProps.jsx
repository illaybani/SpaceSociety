export const getCardProps = (item, showHeartButton = true) => {
  const image = item.image
    ? { url: item.image.url, alt: item.image.alt }
    : { url: "", alt: "" };
  return {
    className: "list-group d-flex align-items-center bg-white",
    id: item._id,
    user_id: item.user_id,
    index: item.index,
    user: item.user,
    description: item.description,
    uploadTime: item.uploadTime,
    image: image,
    uploadedImage: item.uploadedImage,
    likes: item.likes,
    showHeartButton: showHeartButton,
  };
};

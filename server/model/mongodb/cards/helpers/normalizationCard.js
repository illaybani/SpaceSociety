
const normalizeCard = async (card, userId) => {
  if (!card.image) {
    card.image = {
      url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      alt: "loading..",
    };
  }


  card.user_id = card.user_id || userId;
  card.user = card.user || "";
  card.index = card.index || 0;
  card.date = card.date || "";
  card.description = card.description || "";
  card.uploadedImage = card.uploadedImage || "";
  card.uploadTime = card.uploadTime || "";
  card.likes = card.likes || [];
  card.showHeartButton = card.showHeartButton || false;

  return card;
};

module.exports = normalizeCard;

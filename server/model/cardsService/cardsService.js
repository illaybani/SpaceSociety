const config = require("config");
const cardsServiceMongo = require("../mongodb/cards/cardsService");
const dbOption = config.get("dbOption");


const createCard = (cardToSave) => {
  if (dbOption === "mongo") {
    return cardsServiceMongo.createCard(cardToSave);
  }
};

const getAllCards = () => {
  if (dbOption === "mongo") {
    return cardsServiceMongo.getAllCards();
  }
};

const getCardById = (id) => {
  if (dbOption === "mongo") {
    return cardsServiceMongo.getCardById(id);
  }
};

const getCardsByUserId = (userId) => {
  if (dbOption === "mongo") {
    return cardsServiceMongo.getCardsByUserId(userId);
  }
};


const updateCard = (id, cardToUpdate) => {
  if (dbOption === "mongo") {
    return cardsServiceMongo.updateCard(id, cardToUpdate);
  }
};

const updateCardLikes = (id, likes) => {
  if (dbOption === "mongo") {
    return cardsServiceMongo.updateCardLikes(id, likes);
  }
};


const deleteCard = (id) => {
  if (dbOption === "mongo") {
    return cardsServiceMongo.deleteCard(id);
  }
};

const countCards = () => {
  if (dbOption === "mongo") {
    return cardsServiceMongo.countCards();
  }
};


module.exports = {
  createCard,
  getAllCards,
  getCardById,
  getCardsByUserId,
  updateCard,
  updateCardLikes,
  deleteCard,
  countCards,
};

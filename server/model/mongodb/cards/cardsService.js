const Card = require("./Card");

const createCard = (cardToSave) => {
  let card = new Card(cardToSave);
  return card.save();
};

const getAllCards = () => {
  return Card.find();
};

const getCardById = (id) => {
  return Card.findById(id);
};


const updateCard = (id, cardToUpdate) => {
  return Card.findByIdAndUpdate(id, cardToUpdate, {
    new: true,
  });
};

const updateCardLikes = (id, likes) => {
  return Card.findByIdAndUpdate(id, { likes }, { new: true });
};

const getCardsByUserId = async (userId) => {
  return Card.find({ user_id: userId });
};

const deleteCard = (id) => {
  return Card.findByIdAndDelete(id);
};

const countCards = async () => {
  return Card.countDocuments();
};

module.exports = {
  createCard,
  getAllCards,
  getCardById,
  updateCard,
  updateCardLikes,
  getCardsByUserId,
  deleteCard,
  countCards,
};

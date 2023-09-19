const express = require("express");
const router = express.Router();
const cardsServiceModel = require("../../model/cardsService/cardsService");
const normalizeCard = require("../../model/cardsService/helpers/normalizationCardService");
const cardsValidationService = require("../../validation/cardsValidationService");
const auth = require("../../middleware/authMiddleware");
const chalk = require('chalk');
const CustomError = require("../../utils/CustomError");
const { fetchAndSaveCollections } = require('../../persist');

// get all cards
router.get("/", async (req, res) => {
  try {
    const allCards = await cardsServiceModel.getAllCards();
    res.status(200).json(allCards);
  } catch (err) {
    console.error(chalk.redBright('Failed to get all cards:', err.message));
    res.status(err.status || 400).json({ error: err.message });
  }
});

// get a card by id
router.get("/card/:id", async (req, res) => {
  try {
    const cardFromDB = await cardsServiceModel.getCardById(req.params.id);
    res.status(200).json(cardFromDB);
  } catch (err) {
    console.error(chalk.redBright(err.message));
    res.status(err.status || 400).json({ error: err.message });
  }
});

// get all cards of a specific user
router.get("/my-cards", auth, async (req, res) => {
  try {
    let user = req.userData;
    if (!user) {
      throw new CustomError("Unauthorized", 403);
    }
    const cards = await cardsServiceModel.getCardsByUserId(user._id);
    res.status(200).send(cards);
  } catch (err) {
    console.error(chalk.redBright(err.message));
    res.status(err.status || 500).json({ error: err.message });
  }
});

// get a single card of a specific user
router.get("/my-cards/:id", auth, async (req, res) => {
  try {
    const cardFromDB = await cardsServiceModel.getCardById(req.params.id);
    if (!cardFromDB) {
      throw new CustomError("Card not found", 404);
    }
    if (cardFromDB.user_id.toString() !== req.userData._id.toString()) {
      throw new CustomError("Not authorized", 401);
    }
    res.status(200).json(cardFromDB);
  } catch (err) {
    console.error(chalk.redBright(err.message));
    res.status(err.status || 400).json({ error: err.message });
  }
});

//get the number of cards in the database
router.get("/count", async (req, res) => {
  try {
    const count = await cardsServiceModel.countCards();
    res.status(200).send({ count });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while trying to get the card count.' });
  }
});

// update a card of a specific user
router.put("/my-cards/:id", auth, async (req, res) => {
  try {
    const cardFromDB = await cardsServiceModel.getCardById(req.params.id);
    if (!cardFromDB) {
      throw new CustomError("Card not found", 404);
    }
    if (cardFromDB.user_id.toString() !== req.userData._id.toString()) {
      throw new CustomError("Not authorized", 401);
    }
    await cardsValidationService.validateCardSchema(req.body);
    let normalCard = await normalizeCard(req.body, req.userData._id);
    const updatedCard = await cardsServiceModel.updateCard(req.params.id, normalCard);
    res.status(200).json(updatedCard);
    await fetchAndSaveCollections();
  } catch (err) {
    console.error(chalk.redBright(err.message));
    res.status(err.status || 400).json({ error: err.message });
  }
});

// update all cards of a specific user by user_id when username/img changes
router.put("/my_all_cards/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const userCards = await cardsServiceModel.getCardsByUserId(userId);

    if (!userCards || userCards.length === 0) {
      res.send({ noCardsFound: true });
      return;
    }

    const updatedCardPromises = userCards.map(async (card) => {
      const updatedCard = {
        _id: card._id,
        user: req.body.user,
        index: card.index,
        uploadTime: card.uploadTime,
        description: card.description,
        image: card.image,
        likes: card.likes,
        user_id: card.user_id,
        createdAt: card.createdAt,
        __v: card.__v
      };

      if (req.body.user) {
        updatedCard.user = req.body.user;
        updatedCard.image = card.image;
      } else {
        updatedCard.user = card.user;
        updatedCard.image.url = req.body.image.url;
      }

      return cardsServiceModel.updateCard(card._id, updatedCard);
    });

    await Promise.all(updatedCardPromises);

    res.status(200).json({ message: "Cards updated successfully!" });
    await fetchAndSaveCollections();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// create a new card
router.post("/", auth, async (req, res) => {
  try {
    let normalCard = await normalizeCard(req.body, req.userData._id);
    const dataFromMongoose = await cardsServiceModel.createCard(normalCard);
    res.status(200).json(dataFromMongoose);
    await fetchAndSaveCollections();
  } catch (err) {
    console.error(chalk.redBright(err.message));
    res.status(err.status || 400).json({ error: err.message });
  }
});


// delete a card by id
router.delete("/card-user/:id", async (req, res) => {
  try {
    cardsValidationService.validateDeleteCardSchema(req.params);
    const cardFromDB = await cardsServiceModel.deleteCard(req.params.id);
    if (cardFromDB) {
      res.status(200).json({ msg: "Card deleted" });
      await fetchAndSaveCollections();
    } else {
      res.status(404).json({ msg: "Could not find the card" });
    }
  } catch (err) {
    console.error(chalk.redBright(err.message));
    res.status(err.status || 400).json({ error: err.message });
  }
}
);

// like a card
router.patch("/card-like/:id", auth, async (req, res) => {
  try {
    const user = req.userData;
    if (!user || !user._id) {
      throw new CustomError("Invalid user information", 400);
    }
    let card = await cardsServiceModel.getCardById(req.params.id);
    if (!card || !card.likes) {
      throw new CustomError("Card not found or no likes on card", 404);
    }

    if (typeof user._id === 'undefined') {
      console.error(chalk.redBright('user._id is undefined'));
      throw new CustomError("user._id is undefined", 500);
    }

    const cardLikes = card.likes.find((id) => id.toString() === user._id.toString());

    if (!cardLikes) {
      card.likes.push(user._id);
      card = await cardsServiceModel.updateCardLikes(card._id, card.likes);
      res.status(200).send({ card, isLiked: true });
    } else {
      const cardFiltered = card.likes.filter((id) => id.toString() !== user._id.toString());
      card.likes = cardFiltered;
      card = await cardsServiceModel.updateCardLikes(card._id, card.likes);
      res.status(200).send({ card, isLiked: false });
    }

    await fetchAndSaveCollections();

  } catch (error) {
    console.error(chalk.redBright("Could not edit like:", error.message));
    res.status(error.status || 500).json({ error: error.message });
  }
});


module.exports = router;
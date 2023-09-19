const express = require("express");
const router = express.Router();
const {
  registerUserValidation,
  loginUserValidation,
  validateEditUserSchema,
} = require("../../validation/authValidationService");
const normalizeUser = require("../../model/usersService/helpers/normalizationUserService");
const usersServiceModel = require("../../model/mongodb/users/usersService");
const { generateToken } = require("../../utils/token/tokenService");
const CustomError = require("../../utils/CustomError");
const auth = require("../../middleware/authMiddleware");
const _ = require('lodash');
const chalk = require('chalk');
const { fetchAndSaveCollections } = require('../../persist');



//registe new user
router.post("/register", async (req, res) => {
  try {
    await registerUserValidation(req.body);
    let user = await usersServiceModel.getUserByEmail(req.body.email);
    if (user) {
      return res.status(409).json({ msg: "Email already exists" });
    }
    req.body = normalizeUser(req.body);
    user = await usersServiceModel.registerUser(req.body);
    res.status(200).send(_.pick(user, ["_id", "name", "email"]));
    await fetchAndSaveCollections();
  } catch (err) {
    console.error('Error in /register endpoint:', err.message, err.stack);
    res.status(400).json({ message: 'An error occurred.' });
  }
});

//login a user
router.post("/login", async (req, res) => {
  try {
    await loginUserValidation(req.body);
    const userData = await usersServiceModel.getUserByEmail(req.body.email);

    if (!userData) {
      throw new CustomError("Invalid credentials");
    }

    const isPasswordMatch = req.body.password == userData.password;

    if (!isPasswordMatch) {
      throw new CustomError("Invalid credentials");
    }
    const token = await generateToken({
      _id: userData._id,
      isAdmin: userData.isAdmin,
    });

    res.status(200).json({
      token,
      user: _.pick(userData, ["_id", "name", "email", "isAdmin", "phoneNumber", "image", "address", "gender"])
    });

  } catch (err) {
    console.log(err);
    if (err.message === "Invalid credentials") {
      return res.status(401).json({ error: err.message });
    }

    res.status(400).json({ error: err.message });
  }
});


//get info of a user
router.get("/userInfo", auth, async (req, res) => {
  try {
    let user = await usersServiceModel.getUserById(req.userData._id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    user = user.toObject();
    delete user.password;
    delete user.__v;
    delete user.createdAt;
    delete user.isAdmin;
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

//get all users
router.get("/", async (req, res) => {
  try {
    const users = await usersServiceModel.getAllUsers().select({
      "name.firstName": 1,
      "name.lastName": 1,
      email: 1,
      followers: 1,
      following: 1,
      isAdmin: 1,
      "image.url": 1,
      lastLoginTime: 1
    });

    const userCount = await usersServiceModel.countUsers();

    res.status(200).json({ users, userCount });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).send({ error: err.message });
  }
});


//id param- user that got a follower
router.patch("/userInfo/:id", auth, async (req, res) => {
  try {
    let activeUser = req.userData;
    if (!activeUser || !activeUser._id) {
      throw new CustomError("Invalid user information", 400);
    }
    const passiveUser = await usersServiceModel.getUserById(req.params.id);
    activeUser = await usersServiceModel.getUserById(activeUser._id);
    if (!passiveUser) {
      throw new CustomError("User not found", 404);
    }

    if (typeof activeUser._id === 'undefined') {
      console.error(chalk.redBright('activeUser._id is undefined'));
      throw new CustomError("activeUser._id is undefined", 500);
    }

    const isFollowedByActiveUser = passiveUser.followers.find((id) => id.toString() === activeUser._id.toString());

    if (!isFollowedByActiveUser) {
      activeUser.following.push(passiveUser._id);
      passiveUser.followers.push(activeUser._id);
      await usersServiceModel.updateUserFollowers(passiveUser._id, passiveUser.followers);
      await usersServiceModel.updateUserFollowing(activeUser._id, activeUser.following);
      res.status(200).send({ isFollowed: true });
    } else {
      const activeUserFollowingFilterd = activeUser.following.filter((id) => id.toString() !== passiveUser._id.toString());
      const passiveUserFollowersFilterd = passiveUser.followers.filter((id) => id.toString() !== activeUser._id.toString());
      activeUser.following = activeUserFollowingFilterd;
      passiveUser.followers = passiveUserFollowersFilterd;
      await usersServiceModel.updateUserFollowing(activeUser._id, activeUser.following);
      await usersServiceModel.updateUserFollowers(passiveUser._id, passiveUser.followers);
      res.status(200).send({ isFollowed: false });
    }

    await fetchAndSaveCollections();

  } catch (error) {
    console.error(chalk.redBright("Could not edit user:", error.message));
    res.status(error.status || 500).json({ error: error.message });
  }
});

//update the followers and following when a user is deleted
router.put("/updateFollowersAndFollowing/:userId", async (req, res) => {
  try {
    let user = await usersServiceModel.getUserById(req.params.userId);
    const updateFollowersPromises = user.followers.map(async (followerUserId) => {
      const followerUser = await usersServiceModel.getUserById(followerUserId);
      const followerUserFollowingFilterd = followerUser.following.filter((id) => id.toString() !== req.params.userId.toString());
      return usersServiceModel.updateUserFollowing(followerUserId, followerUserFollowingFilterd);
    });

    const updateFollowingPromises = user.following.map(async (followedUserId) => {
      const followedUser = await usersServiceModel.getUserById(followedUserId);
      const followedUserFollowersFilterd = followedUser.followers.filter((id) => id.toString() !== req.params.userId.toString());
      return usersServiceModel.updateUserFollowers(followedUserId, followedUserFollowersFilterd);
    });

    await Promise.all([...updateFollowersPromises, ...updateFollowingPromises]);

    res.status(200).json({ message: "Followers and following lists updated successfully." });
    await fetchAndSaveCollections();
  } catch (error) {
    console.error(chalk.redBright("Could not update:", error.message));
    res.status(error.status || 500).json({ error: error.message });
  }
});

// update user info
router.put("/userInfo", auth, async (req, res) => {
  try {
    const { error } = validateEditUserSchema(req.body);
    if (error) {
      return res.status(400).json(error);
    }
    let updateData = { ...req.body };
    await usersServiceModel.updateUser(req.userData._id, updateData);
    res.status(200).json({ msg: "User details updated successfully" });
    await fetchAndSaveCollections();
  } catch (err) {
    res.status(500).send(err);
  }
});

// update user last login time
router.patch("/userLastLoginTime", async (req, res) => {
  try {
    let updateData = req.body.lastLoginTime;
    let userId = req.body.id;
    await usersServiceModel.updateUserLastLoginTime(userId, updateData);
    res.status(200).json({ msg: "User details updated successfully" });
    await fetchAndSaveCollections();
  } catch (err) {
    res.status(500).send(err);
  }
});

// update user img by img URL
router.put("/userInfo/profileImage", auth, async (req, res) => {
  try {
    let updateProfileImage = await usersServiceModel.updateUser(
      req.userData._id,
      { image: { url: req.body.image.url } }
    );

    if (!updateProfileImage) {
      return res.status(404).send('The user with the given ID was not found.');
    }

    res.status(200).json({ msg: "Profile image updated successfully!" });
    await fetchAndSaveCollections();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});


// delete a user by id
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await usersServiceModel.deleteUser(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ msg: "User deleted successfully.", deletedUser });
    await fetchAndSaveCollections();
  } catch (err) {
    res.status(500).send(err);
  }
});


module.exports = router;
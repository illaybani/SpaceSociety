const config = require("config");
const dbOption = config.get("dbOption");
const usersServiceMongo = require("../mongodb/users/usersService");

const registerUser = (userData) => {
  if (dbOption === "mongo") {
    return usersServiceMongo.registerUser(userData);
  }
};

const getUserByEmail = (email) => {
  if (dbOption === "mongo") {
    return usersServiceMongo.getUserByEmail(email);
  }
};

const getUserById = (id) => {
  if (dbOption === "mongo") {
    return usersServiceMongo.getUserById(id);
  }
};

const getAllUsers = () => {
  if (dbOption === "mongo") {
    return usersServiceMongo.getAllUsers();
  }
};

const updateUser = (userId, updateData) => {
  if (dbOption === "mongo") {
    return usersServiceMongo.updateUser(userId, updateData);
  }
};

const countUsers = () => {
  if (dbOption === "mongo") {
    return usersServiceMongo.countUsers();
  }
};

const deleteUser = (id) => {
  if (dbOption === "mongo") {
    return usersServiceMongo.deleteUser(id);
  }
};

const findUser = (filter) => {
  if (dbOption === "mongo") {
    return usersServiceMongo.findUser(filter);
  }
};

module.exports = {
  registerUser,
  getUserByEmail,
  getUserById,
  updateUser,
  getAllUsers,
  countUsers,
  deleteUser,
  findUser,
};
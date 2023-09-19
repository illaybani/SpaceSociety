const User = require("./Users");

const registerUser = (userData) => {
  const user = new User(userData);
  return user.save();
};

const getUserByEmail = (email) => {
  return User.findOne({ email });
};

const getUserById = (id) => {
  return User.findById(id);
};

const getAllUsers = () => {
  return User.find();
};

const updateUser = (id, updateData) => {
  return User.findByIdAndUpdate(id, updateData, { new: true });
};

const updateUserLastLoginTime = (id, updateData) => {
  return User.findByIdAndUpdate(id, { $set: { lastLoginTime: updateData } }, { new: true });
};

const updateUserFollowers = (id, updateData) => {
  return User.findByIdAndUpdate(id, { $set: { followers: updateData } }, { new: true });
};

const updateUserFollowing = (id, updateData) => {
  return User.findByIdAndUpdate(id, { $set: { following: updateData } }, { new: true });
};

const countUsers = async () => {
  return User.countDocuments();
};

const deleteUser = (id) => {
  return User.findByIdAndRemove(id);
};

const findUser = async (filter) => {
  return User.findOne(filter);
};


module.exports = {
  registerUser,
  getUserByEmail,
  getUserById,
  updateUser,
  updateUserLastLoginTime,
  updateUserFollowers,
  updateUserFollowing,
  getAllUsers,
  countUsers,
  deleteUser,
  findUser,
};
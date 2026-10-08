const User = require("../models/User");

// Create User
const createUser = async (userData) => {
  return await User.create(userData);
};

// Get All Users
const getUsers = async () => {
  return await User.find().sort({ createdAt: -1 });
};

// Get User By ID
const getUserById = async (userId) => {
  return await User.findById(userId);
};

// Get User By Email
const getUserByEmail = async (email) => {
  return await User.findOne({ email }).select("+password");
};

// Update User
const updateUser = async (userId, userData) => {
  return await User.findByIdAndUpdate(
    userId,
    userData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Delete User
const deleteUser = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};
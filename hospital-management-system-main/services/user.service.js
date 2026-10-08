const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/user.repository");
const eventEmitter = require("../events/eventEmitter");

// Create User
const createUser = async (userData) => {
  const { name, email, phone, password, role } = userData;

  // Check if user already exists
  const existingUser = await userRepository.getUserByEmail(email);

  if (existingUser) {
    const error = new Error("User already exists with this email");
    error.statusCode = 409;
    throw error;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.createUser({
    name,
    email,
    phone,
    password: hashedPassword,
    role,
  });

  // Remove password from response
  const userObject = user.toObject();
  delete userObject.password;

  eventEmitter.emit("userCreated", userObject);

  return userObject;
};

// Get All Users
const getUsers = async () => {
  const users = await userRepository.getUsers();

  return users;
};

// Get User By ID
const getUserById = async (userId) => {
  const user = await userRepository.getUserById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

// Update User
const updateUser = async (userId, userData) => {
  const existingUser = await userRepository.getUserById(userId);

  if (!existingUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // If email is being updated, check duplicate email
  if (userData.email && userData.email !== existingUser.email) {
    const emailExists = await userRepository.getUserByEmail(userData.email);

    if (emailExists) {
      const error = new Error("Email already exists");
      error.statusCode = 409;
      throw error;
    }
  }

  // Hash password if password is updated
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }

  const updatedUser = await userRepository.updateUser(
    userId,
    userData
  );

  return updatedUser;
};

// Delete User
const deleteUser = async (userId) => {
  const existingUser = await userRepository.getUserById(userId);

  if (!existingUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  await userRepository.deleteUser(userId);

  return true;
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
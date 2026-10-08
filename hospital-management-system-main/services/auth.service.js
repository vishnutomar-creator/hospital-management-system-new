const authRepository = require("../repositories/auth.repository");

const {
  hashPassword,
  comparePassword,
} = require("../utils/password");

const {
  generateToken,
} = require("../utils/jwt");

const {
  userResponseDTO,
} = require("../dto/auth.dto");

const register = async (userData) => {
  const existingUser =
    await authRepository.findUserByEmail(
      userData.email
    );

  if (existingUser) {
    const error = new Error(
      "User already exists with this email"
    );

    error.statusCode = 409;

    throw error;
  }

  const hashedPassword =
    await hashPassword(userData.password);

  const user =
    await authRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

  const token = generateToken(user);

  return {
    user: userResponseDTO(user),
    token,
  };
};

const login = async (email, password) => {
  const user =
    await authRepository.findUserByEmail(
      email
    );

  if (!user) {
    const error = new Error(
      "Invalid email or password"
    );

    error.statusCode = 401;

    throw error;
  }

  if (!user.isActive) {
    const error = new Error(
      "User account is inactive"
    );

    error.statusCode = 403;

    throw error;
  }

  const isPasswordValid =
    await comparePassword(
      password,
      user.password
    );

  if (!isPasswordValid) {
    const error = new Error(
      "Invalid email or password"
    );

    error.statusCode = 401;

    throw error;
  }

  const token = generateToken(user);

  return {
    user: userResponseDTO(user),
    token,
  };
};

const getMe = async (userId) => {
  const user =
    await authRepository.findUserById(
      userId
    );

  if (!user) {
    const error = new Error(
      "User not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return userResponseDTO(user);
};

module.exports = {
  register,
  login,
  getMe,
};
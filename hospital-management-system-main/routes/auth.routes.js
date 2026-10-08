const express = require("express");

const {
  register,
  login,
  getMe,
} = require("../controllers/auth.controller");

const {
  validateRegister,
  validateLogin,
} = require("../validators/auth.validator");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Register
router.post(
  "/register",
  validateRegister,
  register
);

// Login
router.post(
  "/login",
  validateLogin,
  login
);

// Current User
router.get(
  "/me",
  authMiddleware,
  getMe
);

module.exports = router;
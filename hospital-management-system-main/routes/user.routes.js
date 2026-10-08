const express = require("express");

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const { createUserValidator, updateUserValidator, userIdValidator } = require("../validators/user.validator");

const router = express.Router();

const upload = require("../middlewares/upload.middleware");

// Create User
router.post("/", upload.single("profileImage"), createUserValidator, validationMiddleware, createUser);

// Get All Users
router.get("/", getUsers);

// Get User By ID
router.get("/:id", userIdValidator, validationMiddleware, getUserById);

// Update User By ID
router.put("/:id", upload.single("profileImage"), updateUserValidator, validationMiddleware, updateUser);

// Delete User By ID
router.delete("/:id", userIdValidator, validationMiddleware, deleteUser);

module.exports = router;
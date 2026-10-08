const { body, param } = require("express-validator");

const createUserValidator = [
  body("name").notEmpty().withMessage("Name is required").trim(),
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const updateUserValidator = [
  param("id").isMongoId().withMessage("Invalid user ID"),
  body("email").optional().isEmail().withMessage("Invalid email format"),
];

const userIdValidator = [
  param("id").isMongoId().withMessage("Invalid user ID"),
];

module.exports = {
  createUserValidator,
  updateUserValidator,
  userIdValidator,
};

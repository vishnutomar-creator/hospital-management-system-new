const { body, param } = require("express-validator");

const createDepartmentValidator = [
  body("departmentId")
    .notEmpty()
    .withMessage("Department ID is required")
    .trim(),

  body("name")
    .notEmpty()
    .withMessage("Department name is required")
    .trim()
    .isLength({ min: 2 })
    .withMessage(
      "Department name must be at least 2 characters"
    ),

  body("description")
    .optional()
    .trim(),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
];

const updateDepartmentValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid department ID"),

  body("departmentId")
    .optional()
    .trim(),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage(
      "Department name must be at least 2 characters"
    ),

  body("description")
    .optional()
    .trim(),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
];

const departmentIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid department ID"),
];

module.exports = {
  createDepartmentValidator,
  updateDepartmentValidator,
  departmentIdValidator,
};
const { body, param } = require("express-validator");

const createItemValidator = [
  body("itemName").notEmpty().withMessage("Item name is required").trim(),
  body("category").optional().isIn(["Medicine", "Equipment", "Consumables", "Surgical", "General"]).withMessage("Invalid category"),
  body("quantityInStock").optional().isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer"),
  body("reorderLevel").optional().isInt({ min: 0 }).withMessage("Reorder level must be a non-negative integer"),
  body("unitPrice").notEmpty().withMessage("Unit price is required").isFloat({ min: 0 }).withMessage("Unit price must be positive"),
  body("supplierId").notEmpty().withMessage("Supplier ID is required").isMongoId().withMessage("Invalid Supplier ID"),
  body("expiryDate").optional().isISO8601().withMessage("Invalid date format"),
];

const stockChangeValidator = [
  param("id").notEmpty().withMessage("Item ID is required"),
  body("quantity").notEmpty().withMessage("Quantity is required").isInt({ gt: 0 }).withMessage("Quantity must be a positive integer"),
];

const idValidator = [
  param("id").notEmpty().withMessage("Item ID is required"),
];

module.exports = {
  createItemValidator,
  stockChangeValidator,
  idValidator,
};
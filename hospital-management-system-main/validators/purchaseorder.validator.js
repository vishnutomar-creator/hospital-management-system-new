const { body, param } = require("express-validator");

const createPOValidator = [
    body("supplierId").notEmpty().withMessage("Supplier ID is required").isMongoId().withMessage("Invalid Supplier ID"),
    body("items").isArray({ min: 1 }).withMessage("At least one item is required"),
    body("items.*.itemId").notEmpty().withMessage("Item ID is required").isMongoId().withMessage("Invalid Item ID"),
    body("items.*.quantity").notEmpty().withMessage("Quantity is required").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    body("items.*.unitPrice").notEmpty().withMessage("Unit price is required").isFloat({ min: 0 }).withMessage("Unit price must be positive"),
    body("expectedDeliveryDate").optional().isISO8601().withMessage("Invalid date format"),
];

const idValidator = [
    param("id").notEmpty().withMessage("Purchase order ID is required"),
];

const supplierIdParamValidator = [
    param("supplierId").notEmpty().withMessage("Supplier ID is required"),
];

module.exports = {
    createPOValidator,
    idValidator,
    supplierIdParamValidator,
};
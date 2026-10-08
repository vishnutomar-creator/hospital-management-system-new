const { body, param, query } = require("express-validator");

const createOTValidator = [
    body("otName").notEmpty().withMessage("OT name is required").trim(),
    body("location").optional().trim(),
    body("equipmentAvailable").optional().isArray().withMessage("equipmentAvailable must be an array"),
];

const idValidator = [
    param("id").notEmpty().withMessage("Operation Theater ID is required"),
];

const availabilityValidator = [
    query("date").notEmpty().withMessage("Date is required").isISO8601().withMessage("Invalid date format"),
];

module.exports = {
    createOTValidator,
    idValidator,
    availabilityValidator,
};
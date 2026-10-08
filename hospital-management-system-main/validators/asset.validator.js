const { body, param } = require("express-validator");

const createAssetValidator = [
    body("assetName").notEmpty().withMessage("Asset name is required").trim(),
    body("category").optional().isIn(["Medical Equipment", "Furniture", "IT Equipment", "Vehicle", "Other"]).withMessage("Invalid category"),
    body("purchaseDate").notEmpty().withMessage("Purchase date is required").isISO8601().withMessage("Invalid date format"),
    body("purchasePrice").notEmpty().withMessage("Purchase price is required").isFloat({ min: 0 }).withMessage("Purchase price must be positive"),
    body("warrantyExpiry").optional().isISO8601().withMessage("Invalid date format"),
];

const logMaintenanceValidator = [
    body("assetId").notEmpty().withMessage("Asset ID is required").isMongoId().withMessage("Invalid Asset ID"),
    body("description").notEmpty().withMessage("Description is required").trim(),
    body("cost").optional().isFloat({ min: 0 }).withMessage("Cost must be positive"),
    body("nextDueDate").optional().isISO8601().withMessage("Invalid date format"),
];

const idValidator = [
    param("id").notEmpty().withMessage("ID is required"),
];

const assetIdParamValidator = [
    param("assetId").notEmpty().withMessage("Asset ID is required"),
];

module.exports = {
    createAssetValidator,
    logMaintenanceValidator,
    idValidator,
    assetIdParamValidator,
};
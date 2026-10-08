const { body, param } = require("express-validator");

const createSupplierValidator = [
    body("supplierName").notEmpty().withMessage("Supplier name is required").trim(),
    body("phone").notEmpty().withMessage("Phone is required").trim(),
    body("gstin").optional().trim(),
];

const updateSupplierValidator = [
    param("id").notEmpty().withMessage("Supplier ID is required"),
];

const supplierIdValidator = [
    param("id").notEmpty().withMessage("Supplier ID is required"),
];

module.exports = {
    createSupplierValidator,
    updateSupplierValidator,
    supplierIdValidator,
};
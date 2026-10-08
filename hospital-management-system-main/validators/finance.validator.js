const { body, param } = require("express-validator");

const createLedgerValidator = [
    body("accountCode").notEmpty().withMessage("Account code is required").trim(),
    body("accountName").notEmpty().withMessage("Account name is required").trim(),
    body("debit").optional().isFloat({ min: 0 }).withMessage("Debit must be a positive number"),
    body("credit").optional().isFloat({ min: 0 }).withMessage("Credit must be a positive number"),
];

const createPayableValidator = [
    body("supplierId").notEmpty().withMessage("Supplier ID is required").isMongoId().withMessage("Invalid Supplier ID"),
    body("invoiceNo").notEmpty().withMessage("Invoice number is required").trim(),
    body("amount").notEmpty().withMessage("Amount is required").isFloat({ min: 0 }).withMessage("Amount must be positive"),
    body("dueDate").notEmpty().withMessage("Due date is required").isISO8601().withMessage("Invalid date format"),
];

const createReceivableValidator = [
    body("patientId").notEmpty().withMessage("Patient ID is required").isMongoId().withMessage("Invalid Patient ID"),
    body("billId").notEmpty().withMessage("Bill ID is required").isMongoId().withMessage("Invalid Bill ID"),
    body("amount").notEmpty().withMessage("Amount is required").isFloat({ min: 0 }).withMessage("Amount must be positive"),
    body("dueDate").notEmpty().withMessage("Due date is required").isISO8601().withMessage("Invalid date format"),
];

const idValidator = [
    param("id").notEmpty().withMessage("ID is required"),
];

module.exports = {
    createLedgerValidator,
    createPayableValidator,
    createReceivableValidator,
    idValidator,
};
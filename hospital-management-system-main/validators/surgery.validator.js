const { body, param } = require("express-validator");

const createSurgeryValidator = [
    body("patientId").notEmpty().withMessage("Patient ID is required").isMongoId().withMessage("Invalid Patient ID"),
    body("primarySurgeonId").notEmpty().withMessage("Primary surgeon is required").isMongoId().withMessage("Invalid Doctor ID"),
    body("assistantSurgeonId").optional().isMongoId().withMessage("Invalid Doctor ID"),
    body("otId").optional().isMongoId().withMessage("Invalid OT ID"),
    body("surgeryName").notEmpty().withMessage("Surgery name is required").trim(),
    body("surgeryDate").notEmpty().withMessage("Surgery date is required").isISO8601().withMessage("Invalid date format"),
];

const updateSurgeryValidator = [
    param("id").notEmpty().withMessage("Surgery ID is required"),
];

const surgeryIdValidator = [
    param("id").notEmpty().withMessage("Surgery ID is required"),
];

module.exports = {
    createSurgeryValidator,
    updateSurgeryValidator,
    surgeryIdValidator,
};
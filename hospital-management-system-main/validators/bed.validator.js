const { body, param } = require("express-validator");

const createBedValidator = [
    body("bedNumber").notEmpty().withMessage("Bed number is required").trim(),
    body("wardId").notEmpty().withMessage("Ward ID is required").isMongoId().withMessage("Invalid Ward ID"),
    body("bedType")
        .notEmpty()
        .withMessage("Bed type is required")
        .isIn(["General", "ICU", "Private", "SemiPrivate"])
        .withMessage("Invalid bed type"),
];

const allocateBedValidator = [
    param("id").notEmpty().withMessage("Bed ID is required"),
    body("patientId").notEmpty().withMessage("Patient ID is required").isMongoId().withMessage("Invalid Patient ID"),
    body("admissionId").optional().isMongoId().withMessage("Invalid Admission ID"),
];

const bedIdValidator = [
    param("id").notEmpty().withMessage("Bed ID is required"),
];

module.exports = {
    createBedValidator,
    allocateBedValidator,
    bedIdValidator,
};
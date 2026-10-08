const { body, param } = require("express-validator");

const admitPatientValidator = [
    body("patientId").notEmpty().withMessage("Patient ID is required").isMongoId().withMessage("Invalid Patient ID"),
    body("doctorId").notEmpty().withMessage("Doctor ID is required").isMongoId().withMessage("Invalid Doctor ID"),
    body("bedId").notEmpty().withMessage("Bed ID is required").isMongoId().withMessage("Invalid Bed ID"),
    body("reasonForAdmission").notEmpty().withMessage("Reason for admission is required").trim(),
];

const dischargeValidator = [
    param("id").notEmpty().withMessage("Admission ID is required"),
    body("dischargeSummary").optional().trim(),
];

const transferValidator = [
    param("id").notEmpty().withMessage("Admission ID is required"),
    body("newBedId").notEmpty().withMessage("New Bed ID is required").isMongoId().withMessage("Invalid Bed ID"),
];

const admissionIdValidator = [
    param("id").notEmpty().withMessage("Admission ID is required"),
];

module.exports = {
    admitPatientValidator,
    dischargeValidator,
    transferValidator,
    admissionIdValidator,
};
const { body, param } = require("express-validator");

const orderScanValidator = [
    body("patientId").notEmpty().withMessage("Patient ID is required").isMongoId().withMessage("Invalid Patient ID"),
    body("doctorId").notEmpty().withMessage("Doctor ID is required").isMongoId().withMessage("Invalid Doctor ID"),
    body("modality").notEmpty().withMessage("Modality is required").isIn(["X-Ray", "MRI", "CT", "Ultrasound", "Mammography", "Other"]).withMessage("Invalid modality"),
    body("bodyPart").notEmpty().withMessage("Body part is required").trim(),
    body("priority").optional().isIn(["Routine", "Urgent", "STAT"]).withMessage("Invalid priority"),
];

const scheduleScanValidator = [
    param("id").notEmpty().withMessage("Scan ID is required"),
    body("scanDate").notEmpty().withMessage("Scan date is required").isISO8601().withMessage("Invalid date format"),
];

const submitReportValidator = [
    param("id").notEmpty().withMessage("Scan ID is required"),
    body("findings").notEmpty().withMessage("Findings are required").trim(),
    body("impression").optional().isIn(["Normal", "Abnormal", "Critical"]).withMessage("Invalid impression"),
];

const verifyReportValidator = [
    param("id").notEmpty().withMessage("Scan ID is required"),
    body("verifiedBy").notEmpty().withMessage("Verifying doctor ID is required").isMongoId().withMessage("Invalid Doctor ID"),
];

const scanIdValidator = [
    param("id").notEmpty().withMessage("Scan ID is required"),
];

module.exports = {
    orderScanValidator,
    scheduleScanValidator,
    submitReportValidator,
    verifyReportValidator,
    scanIdValidator,
};
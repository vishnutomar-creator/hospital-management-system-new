const { body, param } = require("express-validator");

const submitClaimValidator = [
    body("patientId").notEmpty().withMessage("Patient ID is required").isMongoId().withMessage("Invalid Patient ID"),
    body("billId").notEmpty().withMessage("Bill ID is required").isMongoId().withMessage("Invalid Bill ID"),
    body("insuranceCompany").notEmpty().withMessage("Insurance company is required").trim(),
    body("policyNo").notEmpty().withMessage("Policy number is required").trim(),
    body("claimAmount").notEmpty().withMessage("Claim amount is required").isFloat({ min: 0 }).withMessage("Claim amount must be positive"),
];

const approveClaimValidator = [
    param("id").notEmpty().withMessage("Claim ID is required"),
    body("approvedAmount").notEmpty().withMessage("Approved amount is required").isFloat({ min: 0 }).withMessage("Approved amount must be positive"),
];

const rejectClaimValidator = [
    param("id").notEmpty().withMessage("Claim ID is required"),
    body("rejectionReason").notEmpty().withMessage("Rejection reason is required").trim(),
];

const idValidator = [
    param("id").notEmpty().withMessage("Claim ID is required"),
];

module.exports = {
    submitClaimValidator,
    approveClaimValidator,
    rejectClaimValidator,
    idValidator,
};
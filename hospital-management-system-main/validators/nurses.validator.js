const { body, param } = require("express-validator");

const createNurseValidator = [
    body("Name").notEmpty().withMessage("Name is required").trim(),
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("phone").notEmpty().withMessage("Phone is required").trim(),
    body("shift").notEmpty().withMessage("Shift is required").isIn(["Morning", "Evening", "Night"]).withMessage("Invalid shift"),
    body("wardId").optional().isMongoId().withMessage("Invalid Ward ID"),
    body("departmentId").optional().isMongoId().withMessage("Invalid Department ID"),
];

const updateNurseValidator = [
    param("id").notEmpty().withMessage("Nurse ID is required"),
];

const nurseIdValidator = [
    param("id").notEmpty().withMessage("Nurse ID is required"),
];

module.exports = {
    createNurseValidator,
    updateNurseValidator,
    nurseIdValidator,
};
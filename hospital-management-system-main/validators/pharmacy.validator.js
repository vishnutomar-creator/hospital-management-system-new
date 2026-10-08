const { body, param } = require("express-validator");

const dispenseMedicineValidator = [
  body("prescriptionId").notEmpty().withMessage("Prescription ID is required").isMongoId().withMessage("Invalid Prescription ID"),
  body("patientId").notEmpty().withMessage("Patient ID is required").isMongoId().withMessage("Invalid Patient ID"),
  body("itemId").notEmpty().withMessage("Item ID is required").isMongoId().withMessage("Invalid Item ID"),
  body("quantity").notEmpty().withMessage("Quantity is required").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];

const dispenseIdValidator = [
  param("id").notEmpty().withMessage("Dispense record ID is required"),
];

module.exports = {
  dispenseMedicineValidator,
  dispenseIdValidator,
};
const { body, param } = require("express-validator");

const createPatientValidator = [
  body("patientId").notEmpty().withMessage("Patient ID is required").trim(),
  body("userId").optional().isMongoId().withMessage("Invalid User ID"),
];

const updatePatientValidator = [
  param("id").notEmpty().withMessage("Patient ID is required"),
  body("userId").optional().isMongoId().withMessage("Invalid User ID"),
];

const patientIdValidator = [
  param("id").notEmpty().withMessage("Patient ID is required"),
];

module.exports = {
  createPatientValidator,
  updatePatientValidator,
  patientIdValidator,
};

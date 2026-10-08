const { body, param } = require("express-validator");

const createDoctorValidator = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID"),

  body("doctorId")
    .notEmpty()
    .withMessage("Doctor ID is required")
    .trim(),

  body("name")
    .notEmpty()
    .withMessage("Doctor name is required")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Doctor name must be at least 2 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone number must be between 10 and 15 digits"),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Invalid gender"),

  body("specialization")
    .notEmpty()
    .withMessage("Specialization is required")
    .trim(),

  body("qualification")
    .notEmpty()
    .withMessage("Qualification is required")
    .trim(),

  body("experience")
    .optional()
    .isNumeric()
    .withMessage("Experience must be a number"),

  body("department")
    .notEmpty()
    .withMessage("Department is required")
    .isMongoId()
    .withMessage("Invalid department ID"),

  body("consultationFee")
    .optional()
    .isNumeric()
    .withMessage("Consultation fee must be a number"),

  body("registrationNumber")
    .notEmpty()
    .withMessage("Registration number is required")
    .trim(),

  body("availability")
    .optional()
    .isIn(["Available", "Unavailable", "On Leave"])
    .withMessage("Invalid availability"),
];

const updateDoctorValidator = [
  param("id")
    .notEmpty()
    .withMessage("Doctor ID is required"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("gender")
    .optional()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Invalid gender"),

  body("experience")
    .optional()
    .isNumeric()
    .withMessage("Experience must be a number"),

  body("department")
    .optional()
    .notEmpty()
    .withMessage("Department cannot be empty"),

  body("consultationFee")
    .optional()
    .isNumeric()
    .withMessage("Consultation fee must be a number"),

  body("availability")
    .optional()
    .isIn(["Available", "Unavailable", "On Leave"])
    .withMessage("Invalid availability"),
];

const doctorIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("Doctor ID is required")
    .trim(),
];

module.exports = {
  createDoctorValidator,
  updateDoctorValidator,
  doctorIdValidator,
};
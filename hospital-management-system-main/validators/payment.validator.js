const { body, param } = require("express-validator");

const createPaymentValidator = [
  body("billingId").notEmpty().withMessage("Billing ID is required").isMongoId().withMessage("Invalid Billing ID"),
  body("patientId").optional({ checkFalsy: true }).isMongoId().withMessage("Invalid Patient ID"),
  body("amount").notEmpty().withMessage("Amount is required").isNumeric().withMessage("Amount must be a number"),
  body("paymentMethod").optional().isString(),
];

const updatePaymentValidator = [
  param("id").isMongoId().withMessage("Invalid payment ID"),
];

const paymentIdValidator = [
  param("id").isMongoId().withMessage("Invalid payment ID"),
];

module.exports = {
  createPaymentValidator,
  updatePaymentValidator,
  paymentIdValidator,
};

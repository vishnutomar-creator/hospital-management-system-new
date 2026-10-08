const express = require("express");

const {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} = require("../controllers/payment.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const { createPaymentValidator, updatePaymentValidator, paymentIdValidator } = require("../validators/payment.validator");

const router = express.Router();

router.post("/", createPaymentValidator, validationMiddleware, createPayment);
router.get("/", getPayments);
router.get("/:id", paymentIdValidator, validationMiddleware, getPaymentById);
router.put("/:id", updatePaymentValidator, validationMiddleware, updatePayment);
router.delete("/:id", paymentIdValidator, validationMiddleware, deletePayment);

module.exports = router;

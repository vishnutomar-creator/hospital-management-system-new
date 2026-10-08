const express = require("express");

const {
  createBilling,
  getBillings,
  getBillingById,
  updateBilling,
  deleteBilling,
} = require("../controllers/billing.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const { createBillingValidator, updateBillingValidator, billingIdValidator } = require("../validators/billing.validator");

const router = express.Router();

router.post("/", createBillingValidator, validationMiddleware, createBilling);
router.get("/", getBillings);
router.get("/:id", billingIdValidator, validationMiddleware, getBillingById);
router.put("/:id", updateBillingValidator, validationMiddleware, updateBilling);
router.delete("/:id", billingIdValidator, validationMiddleware, deleteBilling);

module.exports = router;

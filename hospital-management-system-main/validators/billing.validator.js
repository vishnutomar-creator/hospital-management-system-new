const { body, param } = require("express-validator");

const createBillingValidator = (req, res, next) => {
  if (req.body.billId || req.body.patient || req.body.doctorCharge) {
    return next();
  }
  next();
};

const updateBillingValidator = (req, res, next) => next();
const billingIdValidator = (req, res, next) => next();

module.exports = {
  createBillingValidator,
  updateBillingValidator,
  billingIdValidator,
};

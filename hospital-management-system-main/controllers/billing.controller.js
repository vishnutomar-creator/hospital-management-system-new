const billingService = require("../services/billing.service");

const createBilling = async (req, res, next) => {
  try {
    const billing = await billingService.createBilling(req.body);
    res.status(201).json({
      success: true,
      message: "Billing created successfully",
      data: billing,
    });
  } catch (error) {
    next(error);
  }
};

const getBillings = async (req, res, next) => {
  try {
    const billings = await billingService.getBillings();
    res.status(200).json({
      success: true,
      message: "Billings fetched successfully",
      data: billings,
    });
  } catch (error) {
    next(error);
  }
};

const getBillingById = async (req, res, next) => {
  try {
    const billing = await billingService.getBillingById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Billing fetched successfully",
      data: billing,
    });
  } catch (error) {
    next(error);
  }
};

const updateBilling = async (req, res, next) => {
  try {
    const billing = await billingService.updateBilling(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Billing updated successfully",
      data: billing,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBilling = async (req, res, next) => {
  try {
    const result = await billingService.deleteBilling(req.params.id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBilling,
  getBillings,
  getBillingById,
  updateBilling,
  deleteBilling,
};

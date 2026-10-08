const billingRepository = require("../repositories/billing.repository");

const createBilling = async (billingData) => {
  return await billingRepository.createBilling(billingData);
};

const getBillings = async () => {
  return await billingRepository.getBillings();
};

const getBillingById = async (id) => {
  const billing = await billingRepository.getBillingById(id);
  if (!billing) {
    const error = new Error("Billing not found");
    error.statusCode = 404;
    throw error;
  }
  return billing;
};

const updateBilling = async (id, billingData) => {
  const billing = await billingRepository.getBillingById(id);
  if (!billing) {
    const error = new Error("Billing not found");
    error.statusCode = 404;
    throw error;
  }
  return await billingRepository.updateBilling(id, billingData);
};

const deleteBilling = async (id) => {
  const billing = await billingRepository.getBillingById(id);
  if (!billing) {
    const error = new Error("Billing not found");
    error.statusCode = 404;
    throw error;
  }
  await billingRepository.deleteBilling(id);
  return { message: "Billing deleted successfully" };
};

module.exports = {
  createBilling,
  getBillings,
  getBillingById,
  updateBilling,
  deleteBilling,
};

const Billing = require("../models/Billing");

const createBilling = async (billingData) => {
  const billing = new Billing(billingData);
  return await billing.save();
};

const getBillings = async () => {
  return await Billing.find().populate("patientId").populate("appointmentId");
};

const mongoose = require("mongoose");

const getBillingById = async (id) => {
  const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { billId: id };
  return await Billing.findOne(query).populate("patientId").populate("appointmentId");
};

const updateBilling = async (id, billingData) => {
  const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { billId: id };
  return await Billing.findOneAndUpdate(query, billingData, {
    new: true,
    runValidators: true,
  });
};

const deleteBilling = async (id) => {
  const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { $or: [{ _id: id }, { billId: id }] };
  return await Billing.findOneAndDelete(query);
};

module.exports = {
  createBilling,
  getBillings,
  getBillingById,
  updateBilling,
  deleteBilling,
};

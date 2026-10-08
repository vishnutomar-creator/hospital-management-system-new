const Payment = require("../models/Payment");

const createPayment = async (paymentData) => {
  const payment = new Payment(paymentData);
  return await payment.save();
};

const getPayments = async () => {
  return await Payment.find().populate("billingId").populate("patientId");
};

const getPaymentById = async (id) => {
  return await Payment.findById(id).populate("billingId").populate("patientId");
};

const updatePayment = async (id, paymentData) => {
  return await Payment.findByIdAndUpdate(id, paymentData, {
    new: true,
    runValidators: true,
  });
};

const deletePayment = async (id) => {
  return await Payment.findByIdAndDelete(id);
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};

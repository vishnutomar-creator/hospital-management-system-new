const paymentRepository = require("../repositories/payment.repository");
const billingRepository = require("../repositories/billing.repository");
const eventEmitter = require("../events/eventEmitter");

const createPayment = async (paymentData) => {
  let billing = null;
  if (paymentData.billingId) {
    try {
      billing = await billingRepository.getBillingById(paymentData.billingId);
    } catch (_) {}
  }

  const rawMethod = String(paymentData.paymentMethod || paymentData.method || "cash").toLowerCase();
  const paymentMethod = ["cash", "card", "online", "insurance", "upi"].includes(rawMethod) ? rawMethod : "cash";

  const paymentPayload = {
    ...paymentData,
    paymentMethod,
    patientId: paymentData.patientId || (billing ? (billing.patientId?._id || billing.patientId) : undefined),
    status: paymentData.status || "success",
  };

  const payment = await paymentRepository.createPayment(paymentPayload);
  
  if (payment.status === "success" && billing) {
    try {
      const allPayments = await paymentRepository.getPayments();
      const billingPayments = allPayments.filter(
        (p) =>
          p.billingId &&
          (p.billingId._id ? p.billingId._id.toString() : p.billingId.toString()) === billing._id.toString() &&
          p.status === "success"
      );
      const totalPaid = billingPayments.reduce((acc, curr) => acc + curr.amount, 0);
      
      let status = "Pending";
      if (totalPaid > 0 && totalPaid < (billing.totalAmount || 0)) {
        status = "Partially Paid";
      } else if (totalPaid >= (billing.totalAmount || 0)) {
        status = "Paid";
      }
      
      await billingRepository.updateBilling(billing._id, { status, paymentStatus: status });
    } catch (_) {}
    eventEmitter.emit("paymentSuccess", payment);
  }

  return payment;
};

const getPayments = async () => {
  return await paymentRepository.getPayments();
};

const getPaymentById = async (id) => {
  const payment = await paymentRepository.getPaymentById(id);
  if (!payment) {
    const error = new Error("Payment not found");
    error.statusCode = 404;
    throw error;
  }
  return payment;
};

const updatePayment = async (id, paymentData) => {
  const payment = await paymentRepository.getPaymentById(id);
  if (!payment) {
    const error = new Error("Payment not found");
    error.statusCode = 404;
    throw error;
  }
  return await paymentRepository.updatePayment(id, paymentData);
};

const deletePayment = async (id) => {
  const payment = await paymentRepository.getPaymentById(id);
  if (!payment) {
    const error = new Error("Payment not found");
    error.statusCode = 404;
    throw error;
  }
  await paymentRepository.deletePayment(id);
  return { message: "Payment deleted successfully" };
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};

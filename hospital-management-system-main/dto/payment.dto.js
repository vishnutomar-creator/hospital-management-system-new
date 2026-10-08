const paymentDTO = (payment) => {
  if (!payment) return null;

  return {
    id: payment._id,
    paymentId: payment.paymentId,
    billingId: payment.billingId,
    patientId: payment.patientId,
    amount: payment.amount,
    paymentMethod: payment.paymentMethod,
    transactionId: payment.transactionId,
    status: payment.status,
    paymentDate: payment.paymentDate,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
  };
};

const paymentsDTO = (payments) => {
  if (!Array.isArray(payments)) return [];
  return payments.map((payment) => paymentDTO(payment));
};

module.exports = {
  paymentDTO,
  paymentsDTO,
};

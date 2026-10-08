const billingDTO = (billing) => {
  if (!billing) return null;

  return {
    id: billing._id,
    billingId: billing.billingId,
    patientId: billing.patientId,
    appointmentId: billing.appointmentId,
    items: billing.items,
    totalAmount: billing.totalAmount,
    discount: billing.discount,
    tax: billing.tax,
    netAmount: billing.netAmount,
    status: billing.status,
    dueDate: billing.dueDate,
    createdAt: billing.createdAt,
    updatedAt: billing.updatedAt,
  };
};

const billingsDTO = (billings) => {
  if (!Array.isArray(billings)) return [];
  return billings.map((billing) => billingDTO(billing));
};

module.exports = {
  billingDTO,
  billingsDTO,
};

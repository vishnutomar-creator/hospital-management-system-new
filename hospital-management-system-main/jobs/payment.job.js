const billingRepository = require("../repositories/billing.repository");
const paymentRepository = require("../repositories/payment.repository");

const reconcilePendingPayments = async () => {
  try {
    const billings = await billingRepository.getBillings();
    const payments = await paymentRepository.getPayments();

    let updatedCount = 0;
    for (const bill of billings) {
      if (bill.status !== "paid") {
        const billPayments = payments.filter(
          (p) => p.billingId && p.billingId._id.toString() === bill._id.toString() && p.status === "success"
        );
        const totalPaid = billPayments.reduce((acc, curr) => acc + curr.amount, 0);

        let newStatus = bill.status;
        if (totalPaid >= bill.totalAmount) {
          newStatus = "paid";
        } else if (totalPaid > 0) {
          newStatus = "partially_paid";
        }

        if (newStatus !== bill.status) {
          await billingRepository.updateBilling(bill._id, { status: newStatus });
          updatedCount++;
        }
      }
    }

    return { reconciled: updatedCount };
  } catch (error) {
    console.error("Error reconciling payment job:", error);
    throw error;
  }
};

module.exports = {
  reconcilePendingPayments,
};

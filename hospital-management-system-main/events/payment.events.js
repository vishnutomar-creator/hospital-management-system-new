const eventEmitter = require("./eventEmitter");
const notificationService = require("../services/notification.service");
const Patient = require("../models/Patient");

eventEmitter.on("paymentSuccess", async (payment) => {
  try {
    const patient = await Patient.findById(payment.patientId);
    if (patient) {
      await notificationService.createNotification({
        userId: patient.userId,
        title: "Payment Successful",
        message: `Your payment of ${payment.amount} was successful.`,
        type: "payment",
      });
    }
  } catch (error) {
    console.error("Error in paymentSuccess event:", error);
  }
});

module.exports = eventEmitter;

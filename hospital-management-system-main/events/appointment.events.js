const eventEmitter = require("./eventEmitter");
const notificationService = require("../services/notification.service");
const Patient = require("../models/Patient");

eventEmitter.on("appointmentCreated", async (appointment) => {
  try {
    const patient = await Patient.findById(appointment.patientId);
    if (patient) {
      await notificationService.createNotification({
        userId: patient.userId,
        title: "Appointment Created",
        message: `Your appointment is scheduled on ${new Date(appointment.appointmentDate).toDateString()} at ${appointment.appointmentTime}.`,
        type: "appointment",
      });
    }
  } catch (error) {
    console.error("Error in appointmentCreated event:", error);
  }
});

module.exports = eventEmitter;

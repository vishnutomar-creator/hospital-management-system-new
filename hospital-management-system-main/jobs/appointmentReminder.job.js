const appointmentRepository = require("../repositories/appointment.repository");
const notificationService = require("../services/notification.service");
const emailService = require("../services/email.service");

const runAppointmentReminders = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const appointments = await appointmentRepository.getAppointments();

    const todayAppointments = appointments.filter((apt) => {
      if (!apt.appointmentDate) return false;
      const aptDate = new Date(apt.appointmentDate).toISOString().split("T")[0];
      return aptDate === today && apt.status === "scheduled";
    });

    for (const apt of todayAppointments) {
      if (apt.patientId && apt.patientId.userId) {
        await notificationService.createNotification({
          userId: apt.patientId.userId,
          title: "Appointment Reminder",
          message: `Reminder: You have an appointment scheduled today at ${apt.appointmentTime}.`,
          type: "appointment",
          referenceId: apt._id,
          referenceType: "Appointment",
        });

        if (apt.patientId.email) {
          await emailService.sendEmail(
            apt.patientId.email,
            "Appointment Reminder",
            `Hello ${apt.patientId.name}, you have an appointment scheduled today at ${apt.appointmentTime}.`,
            `<b>Hello ${apt.patientId.name}</b>,<br/>You have an appointment scheduled today at ${apt.appointmentTime}.`
          );
        }
      }
    }

    return { processed: todayAppointments.length };
  } catch (error) {
    console.error("Error running appointment reminders job:", error);
    throw error;
  }
};

module.exports = {
  runAppointmentReminders,
};

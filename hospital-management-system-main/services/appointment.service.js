const appointmentRepository = require("../repositories/appointment.repository");
const eventEmitter = require("../events/eventEmitter");

const createAppointment = async (appointmentData) => {
  const {
    doctorId,
    appointmentDate,
    appointmentTime,
  } = appointmentData;

  // Check doctor availability
  const existingAppointment =
    await appointmentRepository.findExistingAppointment({
      doctorId,
      appointmentDate,
      appointmentTime,
    });

  if (existingAppointment) {
    const error = new Error(
      "Doctor is already booked for this time"
    );

    error.statusCode = 409;

    throw error;
  }

  const appointment = await appointmentRepository.createAppointment(
    appointmentData
  );

  eventEmitter.emit("appointmentCreated", appointment);

  return appointment;
};

const getAppointments = async () => {
  return await appointmentRepository.getAppointments();
};

const getAppointmentById = async (id) => {
  const appointment =
    await appointmentRepository.getAppointmentById(id);

  if (!appointment) {
    const error = new Error(
      "Appointment not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return appointment;
};

const updateAppointment = async (
  id,
  appointmentData
) => {
  const existingAppointment =
    await appointmentRepository.getAppointmentById(id);

  if (!existingAppointment) {
    const error = new Error(
      "Appointment not found"
    );

    error.statusCode = 404;

    throw error;
  }

  // If doctor/date/time changes,
  // check availability
  if (
    appointmentData.doctorId ||
    appointmentData.appointmentDate ||
    appointmentData.appointmentTime
  ) {
    const doctorId =
      appointmentData.doctorId ||
      existingAppointment.doctorId;

    const appointmentDate =
      appointmentData.appointmentDate ||
      existingAppointment.appointmentDate;

    const appointmentTime =
      appointmentData.appointmentTime ||
      existingAppointment.appointmentTime;

    const conflict =
      await appointmentRepository.findExistingAppointment(
        {
          doctorId,
          appointmentDate,
          appointmentTime,
        }
      );

    if (
      conflict &&
      conflict._id.toString() !== id
    ) {
      const error = new Error(
        "Doctor is already booked for this time"
      );

      error.statusCode = 409;

      throw error;
    }
  }

  return await appointmentRepository.updateAppointment(
    id,
    appointmentData
  );
};

const deleteAppointment = async (id) => {
  const appointment =
    await appointmentRepository.getAppointmentById(id);

  if (!appointment) {
    const error = new Error(
      "Appointment not found"
    );

    error.statusCode = 404;

    throw error;
  }

  await appointmentRepository.deleteAppointment(id);

  return appointment;
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
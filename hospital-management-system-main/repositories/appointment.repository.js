const Appointment = require("../models/Appointment");

// Create
const createAppointment = async (appointmentData) => {
  return await Appointment.create(appointmentData);
};

// Get all
const getAppointments = async () => {
  return await Appointment.find()
    .populate("patientId")
    .populate("doctorId")
    .sort({ appointmentDate: 1 });
};

// Get by ID
const getAppointmentById = async (id) => {
  return await Appointment.findById(id)
    .populate("patientId")
    .populate("doctorId");
};

// Update
const updateAppointment = async (
  id,
  appointmentData
) => {
  return await Appointment.findByIdAndUpdate(
    id,
    appointmentData,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("patientId")
    .populate("doctorId");
};

// Delete
const deleteAppointment = async (id) => {
  return await Appointment.findByIdAndDelete(id);
};

// Check doctor availability
const findExistingAppointment = async ({
  doctorId,
  appointmentDate,
  appointmentTime,
}) => {
  return await Appointment.findOne({
    doctorId,
    appointmentDate,
    appointmentTime,
    status: {
      $nin: ["cancelled", "no_show"],
    },
  });
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  findExistingAppointment,
};
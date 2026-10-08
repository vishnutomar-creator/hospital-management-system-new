const appointmentService = require("../services/appointment.service");

const {
  createAppointmentDTO,
  updateAppointmentDTO,
} = require("../dto/appointment.dto");

// CREATE
const createAppointment = async (req, res, next) => {
  try {
    const appointmentData =
      createAppointmentDTO(req.body);

    const appointment =
      await appointmentService.createAppointment(
        appointmentData
      );

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL
const getAppointments = async (req, res, next) => {
  try {
    const appointments =
      await appointmentService.getAppointments();

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// GET BY ID
const getAppointmentById = async (req, res, next) => {
  try {
    const appointment =
      await appointmentService.getAppointmentById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message: "Appointment fetched successfully",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
const updateAppointment = async (req, res, next) => {
  try {
    const appointmentData =
      updateAppointmentDTO(req.body);

    const appointment =
      await appointmentService.updateAppointment(
        req.params.id,
        appointmentData
      );

    return res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
const deleteAppointment = async (req, res, next) => {
  try {
    await appointmentService.deleteAppointment(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
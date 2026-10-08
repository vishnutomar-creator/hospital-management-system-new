const express = require("express");

const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointment.controller");

const {
  validateCreateAppointment,
  validateUpdateAppointment,
} = require("../validators/appointment.validator");

const router = express.Router();

// Create Appointment
router.post(
  "/appointments",
  validateCreateAppointment,
  createAppointment
);

// Get All Appointments
router.get(
  "/appointments",
  getAppointments
);

// Get Appointment By ID
router.get(
  "/appointments/:id",
  getAppointmentById
);

// Update Appointment
router.put(
  "/appointments/:id",
  validateUpdateAppointment,
  updateAppointment
);

// Delete Appointment
router.delete(
  "/appointments/:id",
  deleteAppointment
);

module.exports = router;
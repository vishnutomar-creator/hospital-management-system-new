const express = require("express");

const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctor.controller");

const {
  createDoctorValidator,
  updateDoctorValidator,
  doctorIdValidator,
} = require("../validators/doctor.validator");

const { validationMiddleware } = require("../middlewares/validation.middleware");

const router = express.Router();

// Create Doctor
router.post(
  "/",
  createDoctorValidator,
  validationMiddleware,
  createDoctor
);

// Get All Doctors
router.get(
  "/",
  getDoctors
);

// Get Doctor By ID
router.get(
  "/:id",
  doctorIdValidator,
  validationMiddleware,
  getDoctorById
);

// Update Doctor By ID
router.put(
  "/:id",
  updateDoctorValidator,
  validationMiddleware,
  updateDoctor
);

// Delete Doctor By ID
router.delete(
  "/:id",
  doctorIdValidator,
  validationMiddleware,
  deleteDoctor
);

module.exports = router;
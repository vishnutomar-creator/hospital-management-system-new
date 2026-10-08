const express = require("express");

const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require("../controllers/patient.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const { createPatientValidator, updatePatientValidator, patientIdValidator } = require("../validators/patient.validator");

const router = express.Router();

const upload = require("../middlewares/upload.middleware");

// =========================
// Create Patient
// =========================

router.post("/", upload.single("profileImage"), createPatientValidator, validationMiddleware, createPatient);
router.post("/createpatient", upload.single("profileImage"), createPatientValidator, validationMiddleware, createPatient);

// =========================
// Get All Patients
// =========================

router.get("/", getPatients);
router.get("/getpatients", getPatients);

// =========================
// Get Patient By ID
// =========================

router.get("/:id", patientIdValidator, validationMiddleware, getPatientById);
router.get("/getpatientby/:id", patientIdValidator, validationMiddleware, getPatientById);

// =========================
// Update Patient By ID
// =========================

router.put("/:id", upload.single("profileImage"), updatePatientValidator, validationMiddleware, updatePatient);
router.put("/updatepatientby/:id", upload.single("profileImage"), updatePatientValidator, validationMiddleware, updatePatient);

// =========================
// Delete Patient By ID
// =========================

router.delete("/:id", patientIdValidator, validationMiddleware, deletePatient);
router.delete("/deletepatientby/:id", patientIdValidator, validationMiddleware, deletePatient);

module.exports = router;
const express = require("express");

const {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  getMedicalRecordsByPatient,
  getMedicalRecordsByDoctor,
  updateMedicalRecord,
  deleteMedicalRecord,
} = require("../controllers/medicalRecord.controller");

const {
  validateCreateMedicalRecord,
  validateUpdateMedicalRecord,
} = require("../validators/medicalRecord.validator");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/medical-records",
  authMiddleware,
  validateCreateMedicalRecord,
  createMedicalRecord
);

router.get(
  "/medical-records",
  authMiddleware,
  getMedicalRecords
);

// Specific sub-routes MUST come before the generic /:id route
// to prevent Express treating "patient" / "doctor" as an id
router.get(
  "/medical-records/patient/:patientId",
  authMiddleware,
  getMedicalRecordsByPatient
);

router.get(
  "/medical-records/doctor/:doctorId",
  authMiddleware,
  getMedicalRecordsByDoctor
);

router.get(
  "/medical-records/:id",
  authMiddleware,
  getMedicalRecordById
);

router.put(
  "/medical-records/:id",
  authMiddleware,
  validateUpdateMedicalRecord,
  updateMedicalRecord
);

router.delete(
  "/medical-records/:id",
  authMiddleware,
  deleteMedicalRecord
);

module.exports = router;
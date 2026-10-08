const mongoose = require("mongoose");

const validateObjectId = (
  value,
  fieldName
) => {
  if (!value) {
    return `${fieldName} is required`;
  }

  if (!mongoose.Types.ObjectId.isValid(value)) {
    return `Invalid ${fieldName}`;
  }

  return null;
};

const validateCreatePrescription = (
  req,
  res,
  next
) => {
  // Allow simplified format from frontend forms
  if (req.body.medicineName || req.body.patient || req.body.rxId) {
    return next();
  }

  const {
    patientId,
    doctorId,
    diagnosis,
    medicines,
  } = req.body;

  const patientError = validateObjectId(
    patientId,
    "patientId"
  );

  if (patientError) {
    return res.status(400).json({
      success: false,
      message: patientError,
    });
  }

  const doctorError = validateObjectId(
    doctorId,
    "doctorId"
  );

  if (doctorError) {
    return res.status(400).json({
      success: false,
      message: doctorError,
    });
  }

  if (!diagnosis) {
    return res.status(400).json({
      success: false,
      message: "diagnosis is required",
    });
  }

  if (
    !Array.isArray(medicines) ||
    medicines.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "At least one medicine is required",
    });
  }

  next();
};

const validateUpdatePrescription = (
  req,
  res,
  next
) => {
  if (
    req.body.status &&
    ![
      "active",
      "completed",
      "cancelled",
      "dispensed",
      "returned",
      "pending dispense",
      "pending",
    ].includes(String(req.body.status).toLowerCase())
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid prescription status",
    });
  }

  next();
};

module.exports = {
  validateCreatePrescription,
  validateUpdatePrescription,
};
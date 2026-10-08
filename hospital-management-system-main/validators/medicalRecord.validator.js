const mongoose = require("mongoose");

const validateCreateMedicalRecord = (req, res, next) => {
  const {
    patientId,
    doctorId,
    recordType,
  } = req.body;

  if (!patientId) {
    return res.status(400).json({
      success: false,
      message: "patientId is required",
    });
  }

  if (!doctorId) {
    return res.status(400).json({
      success: false,
      message: "doctorId is required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid patientId",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid doctorId",
    });
  }

  if (recordType) {
    const allowedTypes = [
      "diagnosis",
      "lab_report",
      "imaging",
      "consultation",
      "follow_up",
      "other",
    ];

    if (!allowedTypes.includes(recordType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recordType",
      });
    }
  }

  next();
};

const validateUpdateMedicalRecord = (req, res, next) => {
  if (req.body.recordType) {
    const allowedTypes = [
      "diagnosis",
      "lab_report",
      "imaging",
      "consultation",
      "follow_up",
      "other",
    ];

    if (!allowedTypes.includes(req.body.recordType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recordType",
      });
    }
  }

  if (req.body.status) {
    const allowedStatus = ["active", "archived"];

    if (!allowedStatus.includes(req.body.status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medical record status",
      });
    }
  }

  next();
};

module.exports = {
  validateCreateMedicalRecord,
  validateUpdateMedicalRecord,
};
const mongoose = require("mongoose");

const validateCreateAppointment = (req, res, next) => {
  const {
    patientId,
    doctorId,
    appointmentDate,
    appointmentTime,
    reason,
  } = req.body;

  if (!patientId) {
    return res.status(400).json({
      success: false,
      message: "patientId is required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid patientId",
    });
  }

  if (!doctorId) {
    return res.status(400).json({
      success: false,
      message: "doctorId is required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid doctorId",
    });
  }

  if (!appointmentDate) {
    return res.status(400).json({
      success: false,
      message: "appointmentDate is required",
    });
  }

  if (!appointmentTime) {
    return res.status(400).json({
      success: false,
      message: "appointmentTime is required",
    });
  }

  if (!reason) {
    return res.status(400).json({
      success: false,
      message: "reason is required",
    });
  }

  next();
};

const validateUpdateAppointment = (req, res, next) => {
  const {
    patientId,
    doctorId,
  } = req.body;

  if (
    patientId &&
    !mongoose.Types.ObjectId.isValid(patientId)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid patientId",
    });
  }

  if (
    doctorId &&
    !mongoose.Types.ObjectId.isValid(doctorId)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid doctorId",
    });
  }

  next();
};

module.exports = {
  validateCreateAppointment,
  validateUpdateAppointment,
};
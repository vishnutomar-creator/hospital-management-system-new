const admissionService = require("../services/admission.service");

const admitPatient = async (req, res, next) => {
  try {
    const role = (req.user?.role || "admin").toLowerCase();
    const model = role === "doctor" ? "Doctor" : "Admin";
    const admission = await admissionService.admitPatient(
      req.body,
      req.user.id,
      model
    );

    res.status(201).json({ success: true, message: "Patient admitted successfully", data: admission });
  } catch (error) {
    next(error);
  }
};

const getAdmissions = async (req, res, next) => {
  try {
    const admissions = await admissionService.getAdmissions();
    res.status(200).json({ success: true, message: "Admissions fetched successfully", data: admissions });
  } catch (error) {
    next(error);
  }
};

const getAdmissionById = async (req, res, next) => {
  try {
    const admission = await admissionService.getAdmissionById(req.params.id);
    res.status(200).json({ success: true, message: "Admission fetched successfully", data: admission });
  } catch (error) {
    next(error);
  }
};

const getAdmissionsByPatient = async (req, res, next) => {
  try {
    const admissions = await admissionService.getAdmissionsByPatient(req.params.patientId);
    res.status(200).json({ success: true, message: "Admissions fetched successfully", data: admissions });
  } catch (error) {
    next(error);
  }
};

const dischargePatient = async (req, res, next) => {
  try {
    const { dischargeSummary } = req.body;
    const admission = await admissionService.dischargePatient(req.params.id, dischargeSummary);
    res.status(200).json({ success: true, message: "Patient discharged successfully", data: admission });
  } catch (error) {
    next(error);
  }
};

const transferPatient = async (req, res, next) => {
  try {
    const { newBedId } = req.body;
    const admission = await admissionService.transferPatient(req.params.id, newBedId);
    res.status(200).json({ success: true, message: "Patient transferred successfully", data: admission });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  admitPatient,
  getAdmissions,
  getAdmissionById,
  getAdmissionsByPatient,
  dischargePatient,
  transferPatient,
};
const Admission = require("../models/admissions");

const createAdmission = async (admissionData) => {
  return await Admission.create(admissionData);
};

const getAdmissions = async () => {
  return await Admission.find()
    .populate("patientId", "name patientName patientId phone gender bloodGroup age")
    .populate("doctorId", "name doctorId specialization qualification")
    .populate("wardId", "wardName wardType floor")
    .populate("bedId", "bedNumber status")
    .sort({ createdAt: -1 });
};

const getAdmissionById = async (id) => {
  return await Admission.findById(id)
    .populate("patientId", "name patientName patientId phone gender bloodGroup age")
    .populate("doctorId", "name doctorId specialization qualification")
    .populate("wardId", "wardName wardType floor")
    .populate("bedId", "bedNumber status");
};

const getActiveAdmissionByPatient = async (patientId) => {
  return await Admission.findOne({ patientId, status: "Admitted" });
};

const getAdmissionsByPatient = async (patientId) => {
  return await Admission.find({ patientId })
    .populate("doctorId", "name doctorId specialization qualification")
    .populate("wardId", "wardName wardType floor")
    .populate("bedId", "bedNumber status")
    .sort({ admissionDate: -1 });
};

const updateAdmission = async (id, admissionData) => {
  return await Admission.findByIdAndUpdate(id, admissionData, {
    returnDocument: "after",
    runValidators: true,
  });
};

module.exports = {
  createAdmission,
  getAdmissions,
  getAdmissionById,
  getActiveAdmissionByPatient,
  getAdmissionsByPatient,
  updateAdmission,
};
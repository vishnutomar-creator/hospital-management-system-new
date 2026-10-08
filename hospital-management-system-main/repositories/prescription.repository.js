const Prescription = require(
  "../models/Prescription"
);

// Create
const createPrescription = async (
  prescriptionData
) => {
  return await Prescription.create(
    prescriptionData
  );
};

// Get all
const getPrescriptions = async () => {
  return await Prescription.find()
    .populate(
      "patientId",
      "patientId userId"
    )
    .populate(
      "doctorId",
      "doctorId userId"
    )
    .populate(
      "appointmentId"
    )
    .sort({
      createdAt: -1,
    });
};

const mongoose = require("mongoose");

// Get by ID (supports Mongo _id or rxId)
const getPrescriptionById = async (id) => {
  const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { rxId: id };
  return await Prescription.findOne(query)
    .populate("patientId", "patientId userId")
    .populate("doctorId", "doctorId userId")
    .populate("appointmentId");
};

// Get by patient
const getPrescriptionsByPatient = async (
  patientId
) => {
  return await Prescription.find({
    patientId,
  })
    .populate(
      "doctorId",
      "doctorId userId"
    )
    .sort({
      createdAt: -1,
    });
};

// Get by doctor
const getPrescriptionsByDoctor = async (
  doctorId
) => {
  return await Prescription.find({
    doctorId,
  })
    .populate(
      "patientId",
      "patientId userId"
    )
    .sort({
      createdAt: -1,
    });
};

// Update (supports Mongo _id or rxId)
const updatePrescription = async (
  id,
  prescriptionData
) => {
  const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { rxId: id };
  return await Prescription.findOneAndUpdate(
    query,
    prescriptionData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Delete (supports Mongo _id or rxId)
const deletePrescription = async (id) => {
  const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { rxId: id };
  return await Prescription.findOneAndDelete(query);
};

module.exports = {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  getPrescriptionsByPatient,
  getPrescriptionsByDoctor,
  updatePrescription,
  deletePrescription,
};
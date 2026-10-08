const Patient = require("../models/Patient");

// Create Patient
const createPatient = async (patientData) => {
  return await Patient.create(patientData);
};

// Get All Patients
const getPatients = async () => {
  return await Patient.find()
    .populate("userId", "-password")
    .sort({ createdAt: -1 });
};

const mongoose = require("mongoose");

// Get Patient By ID (supports Mongo _id or patientId)
const getPatientById = async (id) => {
  const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { patientId: id };
  return await Patient.findOne(query).populate("userId", "-password");
};

// Get Patient By Patient ID
const getPatientByPatientId = async (patientId) => {
  return await Patient.findOne({ patientId }).populate("userId", "-password");
};

// Get Patient By User ID
const getPatientByUserId = async (userId) => {
  return await Patient.findOne({ userId }).populate("userId", "-password");
};

// Update Patient
const updatePatient = async (id, patientData) => {
  const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { patientId: id };
  return await Patient.findOneAndUpdate(query, patientData, {
    new: true,
    runValidators: true,
  }).populate("userId", "-password");
};

// Delete Patient
const deletePatient = async (id) => {
  const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { patientId: id };
  return await Patient.findOneAndDelete(query);
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  getPatientByPatientId,
  getPatientByUserId,
  updatePatient,
  deletePatient,
};
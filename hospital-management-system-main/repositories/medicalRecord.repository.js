const MedicalRecord = require("../models/MedicalRecord");

const create = async (data) => {
  return await MedicalRecord.create(data);
};

const findAll = async () => {
  return await MedicalRecord.find()
    .populate("patientId")
    .populate("doctorId")
    .populate("appointmentId")
    .sort({ createdAt: -1 });
};

const findById = async (id) => {
  return await MedicalRecord.findById(id)
    .populate("patientId")
    .populate("doctorId")
    .populate("appointmentId");
};

const findByPatientId = async (patientId) => {
  return await MedicalRecord.find({
    patientId,
  })
    .populate("doctorId")
    .populate("appointmentId")
    .sort({ createdAt: -1 });
};

const findByDoctorId = async (doctorId) => {
  return await MedicalRecord.find({
    doctorId,
  })
    .populate("patientId")
    .populate("appointmentId")
    .sort({ createdAt: -1 });
};

const updateById = async (id, data) => {
  return await MedicalRecord.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("patientId")
    .populate("doctorId")
    .populate("appointmentId");
};

const deleteById = async (id) => {
  return await MedicalRecord.findByIdAndDelete(id);
};

module.exports = {
  create,
  findAll,
  findById,
  findByPatientId,
  findByDoctorId,
  updateById,
  deleteById,
};
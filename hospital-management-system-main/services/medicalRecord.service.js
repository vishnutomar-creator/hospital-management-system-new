const medicalRecordRepository = require("../repositories/medicalRecord.repository");

const createMedicalRecord = async (data) => {
  return await medicalRecordRepository.create(data);
};

const getMedicalRecords = async () => {
  return await medicalRecordRepository.findAll();
};

const getMedicalRecordById = async (id) => {
  const record = await medicalRecordRepository.findById(id);

  if (!record) {
    throw new Error("Medical record not found");
  }

  return record;
};

const getMedicalRecordsByPatient = async (patientId) => {
  return await medicalRecordRepository.findByPatientId(
    patientId
  );
};

const getMedicalRecordsByDoctor = async (doctorId) => {
  return await medicalRecordRepository.findByDoctorId(
    doctorId
  );
};

const updateMedicalRecord = async (id, data) => {
  const record = await medicalRecordRepository.updateById(
    id,
    data
  );

  if (!record) {
    throw new Error("Medical record not found");
  }

  return record;
};

const deleteMedicalRecord = async (id) => {
  const record = await medicalRecordRepository.deleteById(id);

  if (!record) {
    throw new Error("Medical record not found");
  }

  return record;
};

module.exports = {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  getMedicalRecordsByPatient,
  getMedicalRecordsByDoctor,
  updateMedicalRecord,
  deleteMedicalRecord,
};
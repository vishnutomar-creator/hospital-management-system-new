const patientRepository = require("../repositories/patient.repository");

// Create Patient
const createPatient = async (patientData) => {
  // Check Patient ID
  const existingPatient =
    await patientRepository.getPatientByPatientId(
      patientData.patientId
    );

  if (existingPatient) {
    throw new Error("Patient ID already exists");
  }

  // Check User if provided
  if (patientData.userId) {
    const existingUser =
      await patientRepository.getPatientByUserId(
        patientData.userId
      );

    if (existingUser) {
      throw new Error(
        "Patient profile already exists for this user"
      );
    }
  }

  return await patientRepository.createPatient(
    patientData
  );
};

// Get All Patients
const getPatients = async () => {
  return await patientRepository.getPatients();
};

// Get Patient By ID
const getPatientById = async (id) => {
  const patient =
    await patientRepository.getPatientById(id);

  if (!patient) {
    throw new Error("Patient not found");
  }

  return patient;
};

// Update Patient
const updatePatient = async (id, patientData) => {
  const patient =
    await patientRepository.getPatientById(id);

  if (!patient) {
    throw new Error("Patient not found");
  }

  // Check duplicate patientId
  if (patientData.patientId) {
    const existingPatient =
      await patientRepository.getPatientByPatientId(
        patientData.patientId
      );

    if (
      existingPatient &&
      existingPatient._id.toString() !== id
    ) {
      throw new Error("Patient ID already exists");
    }
  }

  // Don't change userId
  delete patientData.userId;

  return await patientRepository.updatePatient(
    id,
    patientData
  );
};

// Delete Patient
const deletePatient = async (id) => {
  const patient =
    await patientRepository.getPatientById(id);

  if (!patient) {
    throw new Error("Patient not found");
  }

  await patientRepository.deletePatient(id);

  return {
    message: "Patient deleted successfully",
  };
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
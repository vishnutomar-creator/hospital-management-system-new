const patientDTO = (patient) => {
  if (!patient) return null;

  return {
    id: patient._id,
    patientId: patient.patientId,
    userId: patient.userId,
    name: patient.name,
    email: patient.email,
    phone: patient.phone,
    gender: patient.gender,
    age: patient.age,
    dateOfBirth: patient.dateOfBirth,
    bloodGroup: patient.bloodGroup,
    address: patient.address,
    medicalHistory: patient.medicalHistory,
    allergies: patient.allergies,
    emergencyContact: patient.emergencyContact,
    profileImage: patient.profileImage,
    createdAt: patient.createdAt,
    updatedAt: patient.updatedAt,
  };
};

const patientsDTO = (patients) => {
  if (!Array.isArray(patients)) return [];
  return patients.map((patient) => patientDTO(patient));
};

module.exports = {
  patientDTO,
  patientsDTO,
};

const doctorRepository = require("../repositories/doctor.repository");

const {
  doctorDTO,
  doctorsDTO,
} = require("../dto/doctor.dto");

// Create doctor
const createDoctor = async (doctorData) => {
  const existingDoctor = await doctorRepository.getDoctorByUserId(
    doctorData.userId
  );

  if (existingDoctor) {
    throw new Error("Doctor already exists for this user");
  }

  const existingDoctorId =
    await doctorRepository.getDoctorByDoctorId(doctorData.doctorId);

  if (existingDoctorId) {
    throw new Error("Doctor ID already exists");
  }

  const existingRegistration =
    await doctorRepository.getDoctorByRegistrationNumber(
      doctorData.registrationNumber
    );

  if (existingRegistration) {
    throw new Error("Registration number already exists");
  }

  const doctor = await doctorRepository.createDoctor(doctorData);

  return doctorDTO(doctor);
};

// Get all doctors
const getDoctors = async () => {
  const doctors = await doctorRepository.getDoctors();

  return doctorsDTO(doctors);
};

// Get doctor by ID
const getDoctorById = async (id) => {
  const doctor = await doctorRepository.getDoctorById(id);

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  return doctorDTO(doctor);
};

// Update doctor
const updateDoctor = async (id, doctorData) => {
  const doctor = await doctorRepository.getDoctorById(id);

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  if (doctorData.doctorId) {
    const existingDoctor =
      await doctorRepository.getDoctorByDoctorId(doctorData.doctorId);

    if (
      existingDoctor &&
      existingDoctor._id.toString() !== id
    ) {
      throw new Error("Doctor ID already exists");
    }
  }

  if (doctorData.registrationNumber) {
    const existingRegistration =
      await doctorRepository.getDoctorByRegistrationNumber(
        doctorData.registrationNumber
      );

    if (
      existingRegistration &&
      existingRegistration._id.toString() !== id
    ) {
      throw new Error("Registration number already exists");
    }
  }

  const updatedDoctor = await doctorRepository.updateDoctor(
    id,
    doctorData
  );

  return doctorDTO(updatedDoctor);
};

// Delete doctor
const deleteDoctor = async (id) => {
  const doctor = await doctorRepository.getDoctorById(id);

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  await doctorRepository.deleteDoctor(id);

  return {
    message: "Doctor deleted successfully",
  };
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
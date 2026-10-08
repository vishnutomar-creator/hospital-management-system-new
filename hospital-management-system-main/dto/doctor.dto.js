const doctorDTO = (doctor) => {
  if (!doctor) {
    return null;
  }

  return {
    id: doctor._id,
    doctorId: doctor.doctorId,
    name: doctor.name,
    email: doctor.email,
    phone: doctor.phone,
    gender: doctor.gender,
    specialization: doctor.specialization,
    qualification: doctor.qualification,
    experience: doctor.experience,
    department: doctor.department,
    consultationFee: doctor.consultationFee,
    registrationNumber: doctor.registrationNumber,
    availability: doctor.availability,
    profileImage: doctor.profileImage,
    address: doctor.address,
    joiningDate: doctor.joiningDate,
    isActive: doctor.isActive,
    createdAt: doctor.createdAt,
    updatedAt: doctor.updatedAt,
  };
};

const doctorsDTO = (doctors) => {
  return doctors.map((doctor) => doctorDTO(doctor));
};

module.exports = {
  doctorDTO,
  doctorsDTO,
};
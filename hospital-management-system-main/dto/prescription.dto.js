const createPrescriptionDTO = (data) => {
  return {
    rxId: data.rxId || data.id,
    recordId: data.recordId || "REC-101",
    patient: data.patient || data.patientName || "Patient",
    patientName: data.patientName || data.patient || "Patient",
    medicineName: data.medicineName || (Array.isArray(data.medicines) && data.medicines[0]?.name) || "",
    dosage: data.dosage || (Array.isArray(data.medicines) && data.medicines[0]?.dosage) || "",
    frequency: data.frequency || (Array.isArray(data.medicines) && data.medicines[0]?.frequency) || "Once daily",
    duration: data.duration || (Array.isArray(data.medicines) && data.medicines[0]?.duration) || "7 days",
    instructions: data.instructions || (Array.isArray(data.medicines) && data.medicines[0]?.instructions) || "",
    patientId: data.patientId || null,
    doctorId: data.doctorId || null,
    appointmentId: data.appointmentId || null,
    diagnosis: data.diagnosis || "General Consultation",
    symptoms: data.symptoms || [],
    medicines: Array.isArray(data.medicines)
      ? data.medicines
      : [
          {
            name: data.medicineName || "",
            dosage: data.dosage || "",
            frequency: data.frequency || "Once daily",
            duration: data.duration || "7 days",
            instructions: data.instructions || "",
          },
        ],
    advice: data.advice || "",
    followUpDate: data.followUpDate || null,
    status: data.status || "Active",
  };
};

const updatePrescriptionDTO = (data) => {
  const dto = {};

  if (data.patient !== undefined) dto.patient = data.patient;
  if (data.patientName !== undefined) dto.patientName = data.patientName;
  if (data.recordId !== undefined) dto.recordId = data.recordId;
  if (data.medicineName !== undefined) dto.medicineName = data.medicineName;
  if (data.dosage !== undefined) dto.dosage = data.dosage;
  if (data.frequency !== undefined) dto.frequency = data.frequency;
  if (data.duration !== undefined) dto.duration = data.duration;
  if (data.instructions !== undefined) dto.instructions = data.instructions;
  if (data.diagnosis !== undefined) dto.diagnosis = data.diagnosis;
  if (data.symptoms !== undefined) dto.symptoms = data.symptoms;
  if (data.medicines !== undefined) dto.medicines = data.medicines;
  if (data.advice !== undefined) dto.advice = data.advice;
  if (data.followUpDate !== undefined) dto.followUpDate = data.followUpDate;
  if (data.status !== undefined) dto.status = data.status;

  return dto;
};

module.exports = {
  createPrescriptionDTO,
  updatePrescriptionDTO,
};
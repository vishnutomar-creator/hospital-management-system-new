const createMedicalRecordDTO = (data) => {
  return {
    patientId: data.patientId,
    doctorId: data.doctorId,
    appointmentId: data.appointmentId || null,

    recordType: data.recordType || "consultation",

    diagnosis: data.diagnosis || "",

    symptoms: Array.isArray(data.symptoms)
      ? data.symptoms
      : [],

    testName: data.testName || "",

    testResult: data.testResult || "",

    doctorNotes: data.doctorNotes || "",

    treatment: data.treatment || "",

    attachments: Array.isArray(data.attachments)
      ? data.attachments
      : [],

    status: data.status || "active",
  };
};

const updateMedicalRecordDTO = (data) => {
  const updateData = {};

  if (data.recordType !== undefined) {
    updateData.recordType = data.recordType;
  }

  if (data.diagnosis !== undefined) {
    updateData.diagnosis = data.diagnosis;
  }

  if (data.symptoms !== undefined) {
    updateData.symptoms = data.symptoms;
  }

  if (data.testName !== undefined) {
    updateData.testName = data.testName;
  }

  if (data.testResult !== undefined) {
    updateData.testResult = data.testResult;
  }

  if (data.doctorNotes !== undefined) {
    updateData.doctorNotes = data.doctorNotes;
  }

  if (data.treatment !== undefined) {
    updateData.treatment = data.treatment;
  }

  if (data.attachments !== undefined) {
    updateData.attachments = data.attachments;
  }

  if (data.status !== undefined) {
    updateData.status = data.status;
  }

  return updateData;
};

module.exports = {
  createMedicalRecordDTO,
  updateMedicalRecordDTO,
};
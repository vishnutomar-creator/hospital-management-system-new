const admissionRepository = require("../repositories/admission.repository");
const bedService = require("./bed.service");
const bedRepository = require("../repositories/bed.repository");

const admitPatient = async (admissionData, admittedBy, admittedByModel) => {
  const { patientId, bedId } = admissionData;

  const existingActive = await admissionRepository.getActiveAdmissionByPatient(patientId);
  if (existingActive) {
    throw new Error("Patient already has an active admission");
  }

  const bed = await bedRepository.getBedById(bedId);
  if (!bed) {
    throw new Error("Bed not found");
  }

  if (bed.status !== "Available") {
    throw new Error(`Selected bed is not available (current status: ${bed.status})`);
  }

  // Create admission first (without bedId conflict), then allocate bed with this admissionId
  const admission = await admissionRepository.createAdmission({
    ...admissionData,
    wardId: bed.wardId,
    admittedBy,
    admittedByModel,
  });

  try {
    await bedService.allocateBed(bedId, patientId, admission._id);
  } catch (error) {
    // rollback admission if bed allocation fails
    await admissionRepository.updateAdmission(admission._id, { status: "Discharged" });
    throw error;
  }

  return await admissionRepository.getAdmissionById(admission._id);
};

const getAdmissions = async () => {
  return await admissionRepository.getAdmissions();
};

const getAdmissionById = async (id) => {
  const admission = await admissionRepository.getAdmissionById(id);
  if (!admission) {
    throw new Error("Admission not found");
  }
  return admission;
};

const getAdmissionsByPatient = async (patientId) => {
  return await admissionRepository.getAdmissionsByPatient(patientId);
};

const dischargePatient = async (id, dischargeSummary) => {
  const admission = await admissionRepository.getAdmissionById(id);
  if (!admission) {
    throw new Error("Admission not found");
  }

  if (admission.status !== "Admitted") {
    throw new Error("This admission is not currently active");
  }

  if (admission.bedId) {
    const bedIdToRelease = admission.bedId._id || admission.bedId;
    try {
      await bedService.releaseBed(bedIdToRelease);
    } catch (bedErr) {
      console.warn("Could not release bed automatically:", bedErr.message);
    }
  }

  return await admissionRepository.updateAdmission(id, {
    status: "Discharged",
    dischargeDate: new Date(),
    dischargeSummary: dischargeSummary || "Discharged from inpatient care.",
  });
};

const transferPatient = async (id, newBedId) => {
  const admission = await admissionRepository.getAdmissionById(id);
  if (!admission) {
    throw new Error("Admission not found");
  }

  if (admission.status !== "Admitted") {
    throw new Error("Only active admissions can be transferred");
  }

  const newBed = await bedRepository.getBedById(newBedId);
  if (!newBed) {
    throw new Error("New bed not found");
  }

  if (newBed.status !== "Available") {
    throw new Error("New bed is not available");
  }

  // release old bed, allocate new bed
  if (admission.bedId) {
    const bedIdToRelease = admission.bedId._id || admission.bedId;
    try {
      await bedService.releaseBed(bedIdToRelease);
    } catch (_) {}
  }
  await bedService.allocateBed(newBedId, admission.patientId?._id || admission.patientId, id);

  return await admissionRepository.updateAdmission(id, {
    bedId: newBedId,
    wardId: newBed.wardId,
  });
};

module.exports = {
  admitPatient,
  getAdmissions,
  getAdmissionById,
  getAdmissionsByPatient,
  dischargePatient,
  transferPatient,
};
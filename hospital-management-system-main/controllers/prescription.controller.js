const prescriptionService = require(
  "../services/prescription.service"
);

const {
  createPrescriptionDTO,
  updatePrescriptionDTO,
} = require("../dto/prescription.dto");

// CREATE
const createPrescription = async (
  req,
  res,
  next
) => {
  try {
    const prescriptionData =
      createPrescriptionDTO(req.body);

    const prescription =
      await prescriptionService.createPrescription(
        prescriptionData
      );

    return res.status(201).json({
      success: true,
      message:
        "Prescription created successfully",
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL
const getPrescriptions = async (
  req,
  res,
  next
) => {
  try {
    const prescriptions =
      await prescriptionService.getPrescriptions();

    return res.status(200).json({
      success: true,
      message:
        "Prescriptions fetched successfully",
      data: prescriptions,
    });
  } catch (error) {
    next(error);
  }
};

// GET BY ID
const getPrescriptionById = async (
  req,
  res,
  next
) => {
  try {
    const prescription =
      await prescriptionService.getPrescriptionById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Prescription fetched successfully",
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
};

// GET BY PATIENT
const getPrescriptionsByPatient = async (
  req,
  res,
  next
) => {
  try {
    const prescriptions =
      await prescriptionService.getPrescriptionsByPatient(
        req.params.patientId
      );

    return res.status(200).json({
      success: true,
      message:
        "Patient prescriptions fetched successfully",
      data: prescriptions,
    });
  } catch (error) {
    next(error);
  }
};

// GET BY DOCTOR
const getPrescriptionsByDoctor = async (
  req,
  res,
  next
) => {
  try {
    const prescriptions =
      await prescriptionService.getPrescriptionsByDoctor(
        req.params.doctorId
      );

    return res.status(200).json({
      success: true,
      message:
        "Doctor prescriptions fetched successfully",
      data: prescriptions,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
const updatePrescription = async (
  req,
  res,
  next
) => {
  try {
    const prescriptionData =
      updatePrescriptionDTO(req.body);

    const prescription =
      await prescriptionService.updatePrescription(
        req.params.id,
        prescriptionData
      );

    return res.status(200).json({
      success: true,
      message:
        "Prescription updated successfully",
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
const deletePrescription = async (
  req,
  res,
  next
) => {
  try {
    await prescriptionService.deletePrescription(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Prescription deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// DISPENSE
const dispensePrescription = async (req, res, next) => {
  try {
    const prescription = await prescriptionService.dispensePrescription(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Prescription dispensed successfully",
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
};

// RETURN
const returnPrescription = async (req, res, next) => {
  try {
    const prescription = await prescriptionService.returnPrescription(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Prescription return processed successfully",
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  getPrescriptionsByPatient,
  getPrescriptionsByDoctor,
  updatePrescription,
  deletePrescription,
  dispensePrescription,
  returnPrescription,
};
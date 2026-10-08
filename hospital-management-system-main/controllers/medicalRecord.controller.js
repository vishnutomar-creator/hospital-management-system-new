const medicalRecordService = require("../services/medicalRecord.service");

const {
  createMedicalRecordDTO,
  updateMedicalRecordDTO,
} = require("../dto/medicalRecord.dto");

const createMedicalRecord = async (req, res, next) => {
  try {
    const data = createMedicalRecordDTO(req.body);

    const record =
      await medicalRecordService.createMedicalRecord(data);

    return res.status(201).json({
      success: true,
      message: "Medical record created successfully",
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

const getMedicalRecords = async (req, res, next) => {
  try {
    const records =
      await medicalRecordService.getMedicalRecords();

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

const getMedicalRecordById = async (req, res, next) => {
  try {
    const record =
      await medicalRecordService.getMedicalRecordById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

const getMedicalRecordsByPatient = async (
  req,
  res,
  next
) => {
  try {
    const records =
      await medicalRecordService.getMedicalRecordsByPatient(
        req.params.patientId
      );

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

const getMedicalRecordsByDoctor = async (
  req,
  res,
  next
) => {
  try {
    const records =
      await medicalRecordService.getMedicalRecordsByDoctor(
        req.params.doctorId
      );

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

const updateMedicalRecord = async (req, res, next) => {
  try {
    const data = updateMedicalRecordDTO(req.body);

    const record =
      await medicalRecordService.updateMedicalRecord(
        req.params.id,
        data
      );

    return res.status(200).json({
      success: true,
      message: "Medical record updated successfully",
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMedicalRecord = async (req, res, next) => {
  try {
    await medicalRecordService.deleteMedicalRecord(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Medical record deleted successfully",
    });
  } catch (error) {
    next(error);
  }
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
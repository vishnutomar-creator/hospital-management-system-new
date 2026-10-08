const patientService = require("../services/patient.service");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// Create Patient
const createPatient = async (req, res, next) => {
  try {
    console.log("PATIENT BODY:", req.body);

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "hms/patients",
      });
      req.body.profileImage = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const patient = await patientService.createPatient(req.body);

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Patients
const getPatients = async (req, res, next) => {
  try {
    const patients = await patientService.getPatients();

    res.status(200).json({
      success: true,
      message: "Patients fetched successfully",
      data: patients,
    });
  } catch (error) {
    next(error);
  }
};

// Get Patient By ID
const getPatientById = async (req, res, next) => {
  try {
    const patient = await patientService.getPatientById(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Patient fetched successfully",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// Update Patient
const updatePatient = async (req, res, next) => {
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "hms/patients",
      });
      req.body.profileImage = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const patient = await patientService.updatePatient(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Patient
const deletePatient = async (req, res, next) => {
  try {
    const result = await patientService.deletePatient(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
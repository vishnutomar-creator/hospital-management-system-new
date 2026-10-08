const doctorService = require("../services/doctor.service");

// Create Doctor
const createDoctor = async (req, res, next) => {
  try {
    const doctor = await doctorService.createDoctor(req.body);

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Doctors
const getDoctors = async (req, res, next) => {
  try {
    const doctors = await doctorService.getDoctors();

    return res.status(200).json({
      success: true,
      message: "Doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

// Get Doctor By ID
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await doctorService.getDoctorById(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Doctor fetched successfully",
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// Update Doctor
const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await doctorService.updateDoctor(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Doctor
const deleteDoctor = async (req, res, next) => {
  try {
    const result = await doctorService.deleteDoctor(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
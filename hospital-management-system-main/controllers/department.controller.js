const departmentService = require("../services/department.service");

// Create Department
const createDepartment = async (req, res, next) => {
  try {
    const department =
      await departmentService.createDepartment(req.body);

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Departments
const getDepartments = async (req, res, next) => {
  try {
    const departments =
      await departmentService.getDepartments();

    return res.status(200).json({
      success: true,
      message: "Departments fetched successfully",
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

// Get Department By ID
const getDepartmentById = async (req, res, next) => {
  try {
    const department =
      await departmentService.getDepartmentById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message: "Department fetched successfully",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// Update Department
const updateDepartment = async (req, res, next) => {
  try {
    const department =
      await departmentService.updateDepartment(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Department
const deleteDepartment = async (req, res, next) => {
  try {
    const result =
      await departmentService.deleteDepartment(
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
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
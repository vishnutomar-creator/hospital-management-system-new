const Department = require("../models/Department");

// Create Department
const createDepartment = async (departmentData) => {
  return await Department.create(departmentData);
};

// Get All Departments
const getDepartments = async () => {
  return await Department.find().sort({ createdAt: -1 });
};

// Get Department By ID
const getDepartmentById = async (id) => {
  return await Department.findById(id);
};

// Get Department By Department ID
const getDepartmentByDepartmentId = async (departmentId) => {
  return await Department.findOne({ departmentId });
};

// Get Department By Name
const getDepartmentByName = async (name) => {
  return await Department.findOne({ name });
};

// Update Department
const updateDepartment = async (id, departmentData) => {
  return await Department.findByIdAndUpdate(
    id,
    departmentData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Delete Department
const deleteDepartment = async (id) => {
  return await Department.findByIdAndDelete(id);
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  getDepartmentByDepartmentId,
  getDepartmentByName,
  updateDepartment,
  deleteDepartment,
};
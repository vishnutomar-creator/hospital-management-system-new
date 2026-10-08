const departmentRepository = require("../repositories/department.repository");

// Create Department
const createDepartment = async (departmentData) => {
  const existingDepartment =
    await departmentRepository.getDepartmentByDepartmentId(
      departmentData.departmentId
    );

  if (existingDepartment) {
    throw new Error("Department ID already exists");
  }

  const existingName =
    await departmentRepository.getDepartmentByName(
      departmentData.name
    );

  if (existingName) {
    throw new Error("Department name already exists");
  }

  return await departmentRepository.createDepartment(
    departmentData
  );
};

// Get All Departments
const getDepartments = async () => {
  return await departmentRepository.getDepartments();
};

// Get Department By ID
const getDepartmentById = async (id) => {
  const department =
    await departmentRepository.getDepartmentById(id);

  if (!department) {
    throw new Error("Department not found");
  }

  return department;
};

// Update Department
const updateDepartment = async (id, departmentData) => {
  const department =
    await departmentRepository.getDepartmentById(id);

  if (!department) {
    throw new Error("Department not found");
  }

  if (departmentData.departmentId) {
    const existingDepartment =
      await departmentRepository.getDepartmentByDepartmentId(
        departmentData.departmentId
      );

    if (
      existingDepartment &&
      existingDepartment._id.toString() !== id
    ) {
      throw new Error("Department ID already exists");
    }
  }

  if (departmentData.name) {
    const existingName =
      await departmentRepository.getDepartmentByName(
        departmentData.name
      );

    if (
      existingName &&
      existingName._id.toString() !== id
    ) {
      throw new Error("Department name already exists");
    }
  }

  return await departmentRepository.updateDepartment(
    id,
    departmentData
  );
};

// Delete Department
const deleteDepartment = async (id) => {
  const department =
    await departmentRepository.getDepartmentById(id);

  if (!department) {
    throw new Error("Department not found");
  }

  await departmentRepository.deleteDepartment(id);

  return {
    message: "Department deleted successfully",
  };
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
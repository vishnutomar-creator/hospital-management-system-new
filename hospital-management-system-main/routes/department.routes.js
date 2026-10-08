const express = require("express");

const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/department.controller");

const {
  createDepartmentValidator,
  updateDepartmentValidator,
  departmentIdValidator,
} = require("../validators/department.validator");

const {
  validationMiddleware,
} = require("../middlewares/validation.middleware");

const router = express.Router();

// Create Department
router.post(
  "/",
  createDepartmentValidator,
  validationMiddleware,
  createDepartment
);

// Get All Departments
router.get(
  "/",
  getDepartments
);

// Get Department By ID
router.get(
  "/:id",
  departmentIdValidator,
  validationMiddleware,
  getDepartmentById
);

// Update Department
router.put(
  "/:id",
  updateDepartmentValidator,
  validationMiddleware,
  updateDepartment
);

// Delete Department
router.delete(
  "/:id",
  departmentIdValidator,
  validationMiddleware,
  deleteDepartment
);

module.exports = router;
const express = require("express");

const {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
} = require("../controllers/supplier.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const {
    createSupplierValidator,
    updateSupplierValidator,
    supplierIdValidator,
} = require("../validators/supplier.validator");

const router = express.Router();

router.post("/", createSupplierValidator, validationMiddleware, createSupplier);
router.post("/createsupplier", createSupplierValidator, validationMiddleware, createSupplier);
router.get("/", getSuppliers);
router.get("/getsuppliers", getSuppliers);
router.get("/:id", supplierIdValidator, validationMiddleware, getSupplierById);
router.get("/getsupplierby/:id", supplierIdValidator, validationMiddleware, getSupplierById);
router.put("/:id", updateSupplierValidator, validationMiddleware, updateSupplier);
router.put("/updatesupplierby/:id", updateSupplierValidator, validationMiddleware, updateSupplier);
router.delete("/:id", supplierIdValidator, validationMiddleware, deleteSupplier);
router.delete("/deletesupplierby/:id", supplierIdValidator, validationMiddleware, deleteSupplier);

module.exports = router;
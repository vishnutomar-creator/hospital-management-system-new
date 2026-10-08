const supplierService = require("../services/supplier.services");

const createSupplier = async (req, res, next) => {
    try {
        const supplier = await supplierService.createSupplier(req.body);

        res.status(201).json({
            success: true,
            message: "Supplier created successfully",
            data: supplier,
        });
    } catch (error) {
        next(error);
    }
};

const getSuppliers = async (req, res, next) => {
    try {
        const suppliers = await supplierService.getSuppliers();

        res.status(200).json({
            success: true,
            message: "Suppliers fetched successfully",
            data: suppliers,
        });
    } catch (error) {
        next(error);
    }
};

const getSupplierById = async (req, res, next) => {
    try {
        const supplier = await supplierService.getSupplierById(req.params.id);

        res.status(200).json({
            success: true,
            message: "Supplier fetched successfully",
            data: supplier,
        });
    } catch (error) {
        next(error);
    }
};

const updateSupplier = async (req, res, next) => {
    try {
        const supplier = await supplierService.updateSupplier(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: "Supplier updated successfully",
            data: supplier,
        });
    } catch (error) {
        next(error);
    }
};

const deleteSupplier = async (req, res, next) => {
    try {
        const result = await supplierService.deleteSupplier(req.params.id);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
};
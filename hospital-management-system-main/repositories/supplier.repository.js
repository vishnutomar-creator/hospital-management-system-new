const Supplier = require("../models/supplier");

const createSupplier = async (supplierData) => {
    return await Supplier.create(supplierData);
};

const getSuppliers = async () => {
    return await Supplier.find().sort({ createdAt: -1 });
};

const getSupplierById = async (id) => {
    return await Supplier.findById(id);
};

const getSupplierByGstin = async (gstin) => {
    return await Supplier.findOne({ gstin });
};

const updateSupplier = async (id, supplierData) => {
    return await Supplier.findByIdAndUpdate(id, supplierData, {
        new: true,
        runValidators: true,
    });
};

const deleteSupplier = async (id) => {
    return await Supplier.findByIdAndDelete(id);
};

module.exports = {
    createSupplier,
    getSuppliers,
    getSupplierById,
    getSupplierByGstin,
    updateSupplier,
    deleteSupplier,
};
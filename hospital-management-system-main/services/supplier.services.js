const supplierRepository = require("../repositories/supplier.repository");

const createSupplier = async (supplierData) => {
  if (supplierData.gstin) {
    const existing = await supplierRepository.getSupplierByGstin(supplierData.gstin);
    if (existing) {
      throw new Error("Supplier with this GSTIN already exists");
    }
  }

  return await supplierRepository.createSupplier(supplierData);
};

const getSuppliers = async () => {
  return await supplierRepository.getSuppliers();
};

const getSupplierById = async (id) => {
  const supplier = await supplierRepository.getSupplierById(id);

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  return supplier;
};

const updateSupplier = async (id, supplierData) => {
  const supplier = await supplierRepository.getSupplierById(id);

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  if (supplierData.gstin) {
    const existing = await supplierRepository.getSupplierByGstin(supplierData.gstin);
    if (existing && existing._id.toString() !== id) {
      throw new Error("Supplier with this GSTIN already exists");
    }
  }

  return await supplierRepository.updateSupplier(id, supplierData);
};

const deleteSupplier = async (id) => {
  const supplier = await supplierRepository.getSupplierById(id);

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  await supplierRepository.deleteSupplier(id);

  return { message: "Supplier deleted successfully" };
};

module.exports = {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
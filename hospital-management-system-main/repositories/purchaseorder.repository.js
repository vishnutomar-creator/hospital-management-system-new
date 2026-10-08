const PurchaseOrder = require("../models/purchaseorder");

const createPO = async (poData) => {
    return await PurchaseOrder.create(poData);
};

const getPOs = async () => {
    return await PurchaseOrder.find()
        .populate("supplierId", "SupplierName phone")
        .populate("items.itemId", "itemName unit")
        .sort({ createdAt: -1 });
};

const getPOById = async (id) => {
    return await PurchaseOrder.findById(id)
        .populate("supplierId", "SupplierName phone")
        .populate("items.itemId", "itemName unit");
};

const getPOsBySupplier = async (supplierId) => {
    return await PurchaseOrder.find({ supplierId }).sort({ orderDate: -1 });
};

const getPOsByStatus = async (status) => {
    return await PurchaseOrder.find({ status })
        .populate("supplierId", "SupplierName")
        .sort({ orderDate: -1 });
};

const updatePO = async (id, poData) => {
    return await PurchaseOrder.findByIdAndUpdate(id, poData, {
        new: true,
        runValidators: true,
    });
};

const deletePO = async (id) => {
    return await PurchaseOrder.findByIdAndDelete(id);
};

module.exports = {
    createPO,
    getPOs,
    getPOById,
    getPOsBySupplier,
    getPOsByStatus,
    updatePO,
    deletePO,
};
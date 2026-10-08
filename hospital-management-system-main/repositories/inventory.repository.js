const InventoryItem = require("../models/inventoryitem");

const createItem = async (itemData) => {
    return await InventoryItem.create(itemData);
};

const getItems = async () => {
    return await InventoryItem.find().populate("supplierId").sort({ createdAt: -1 });
};

const getItemById = async (id) => {
    return await InventoryItem.findById(id).populate("supplierId");
};

const getItemByNameAndBatch = async (itemName, batchNumber) => {
    return await InventoryItem.findOne({ itemName, batchNumber });
};

const updateItem = async (id, itemData) => {
    return await InventoryItem.findByIdAndUpdate(
        id,
        itemData,
        { new: true, runValidators: true }
    );
};

const incrementStock = async (id, quantity) => {
    return await InventoryItem.findByIdAndUpdate(
        id,
        { $inc: { quantityInStock: quantity } },
        { new: true }
    );
};

const decrementStock = async (id, quantity) => {
    return await InventoryItem.findByIdAndUpdate(
        id,
        { $inc: { quantityInStock: -quantity } },
        { new: true }
    );
};

const deductStock = async (id, quantity) => {
    return await decrementStock(id, quantity);
};

const restoreStock = async (id, quantity) => {
    return await incrementStock(id, quantity);
};

const getLowStockItems = async () => {
    return await InventoryItem.find({
        $expr: { $lte: ["$quantityInStock", "$reorderLevel"] }
    }).populate("supplierId");
};

const getExpiringItems = async () => {
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return await InventoryItem.find({
        expiryDate: { $ne: null, $lte: thirtyDaysFromNow }
    }).populate("supplierId");
};

const deleteItem = async (id) => {
    return await InventoryItem.findByIdAndDelete(id);
};

module.exports = {
    createItem,
    getItems,
    getItemById,
    getItemByNameAndBatch,
    updateItem,
    incrementStock,
    decrementStock,
    deductStock,
    restoreStock,
    getLowStockItems,
    getExpiringItems,
    deleteItem,
};
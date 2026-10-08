const Inventory = require("../models/inventory");

const getInventoryItemById = async (id) => {
    return await Inventory.findById(id);
};

const deductStock = async (id, quantity) => {
    return await Inventory.findByIdAndUpdate(
        id,
        { $inc: { quantityInStock: -quantity } },
        { new: true }
    );
};

const restoreStock = async (id, quantity) => {
    return await Inventory.findByIdAndUpdate(
        id,
        { $inc: { quantityInStock: quantity } },
        { new: true }
    );
};

module.exports = {
    getInventoryItemById,
    deductStock,
    restoreStock,
};
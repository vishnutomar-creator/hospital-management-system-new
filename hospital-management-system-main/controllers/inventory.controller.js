const inventoryService = require("../services/inventory.service");

const createItem = async (req, res, next) => {
  try {
    const item = await inventoryService.createItem(req.body);
    res.status(201).json({ success: true, message: "Inventory item created successfully", data: item });
  } catch (error) {
    next(error);
  }
};

const getItems = async (req, res, next) => {
  try {
    const items = await inventoryService.getItems();
    res.status(200).json({ success: true, message: "Inventory items fetched successfully", data: items });
  } catch (error) {
    next(error);
  }
};

const getItemById = async (req, res, next) => {
  try {
    const item = await inventoryService.getItemById(req.params.id);
    res.status(200).json({ success: true, message: "Inventory item fetched successfully", data: item });
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const item = await inventoryService.updateItem(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Inventory item updated successfully", data: item });
  } catch (error) {
    next(error);
  }
};

const restockItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const item = await inventoryService.restockItem(req.params.id, quantity);
    res.status(200).json({ success: true, message: "Item restocked successfully", data: item });
  } catch (error) {
    next(error);
  }
};

const consumeItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const item = await inventoryService.consumeItem(req.params.id, quantity);
    res.status(200).json({ success: true, message: "Stock consumed successfully", data: item });
  } catch (error) {
    next(error);
  }
};

const getLowStockItems = async (req, res, next) => {
  try {
    const items = await inventoryService.getLowStockItems();
    res.status(200).json({ success: true, message: "Low stock items fetched successfully", data: items });
  } catch (error) {
    next(error);
  }
};

const getExpiringItems = async (req, res, next) => {
  try {
    const items = await inventoryService.getExpiringItems();
    res.status(200).json({ success: true, message: "Expiring items fetched successfully", data: items });
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const result = await inventoryService.deleteItem(req.params.id);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  restockItem,
  consumeItem,
  getLowStockItems,
  getExpiringItems,
  deleteItem,
};
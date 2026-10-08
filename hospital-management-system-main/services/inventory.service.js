const inventoryRepository = require("../repositories/inventory.repository");

const createItem = async (itemData) => {
    if (itemData.batchNumber) {
        const existing = await inventoryRepository.getItemByNameAndBatch(itemData.itemName, itemData.batchNumber);
        if (existing) {
            throw new Error("An item with this name and batch number already exists");
        }
    }

    return await inventoryRepository.createItem(itemData);
};

const getItems = async () => {
    return await inventoryRepository.getItems();
};

const getItemById = async (id) => {
    const item = await inventoryRepository.getItemById(id);
    if (!item) {
        throw new Error("Inventory item not found");
    }
    return item;
};

const updateItem = async (id, itemData) => {
    const item = await inventoryRepository.getItemById(id);
    if (!item) {
        throw new Error("Inventory item not found");
    }

    // Stock quantity must change only via restock/consume, not direct edit
    delete itemData.quantityInStock;

    return await inventoryRepository.updateItem(id, itemData);
};

const restockItem = async (id, quantity) => {
    if (quantity <= 0) {
        throw new Error("Restock quantity must be greater than zero");
    }

    const item = await inventoryRepository.getItemById(id);
    if (!item) {
        throw new Error("Inventory item not found");
    }

    return await inventoryRepository.incrementStock(id, quantity);
};

const consumeItem = async (id, quantity) => {
    if (quantity <= 0) {
        throw new Error("Consume quantity must be greater than zero");
    }

    const item = await inventoryRepository.getItemById(id);
    if (!item) {
        throw new Error("Inventory item not found");
    }

    if (item.quantityInStock < quantity) {
        throw new Error("Insufficient stock available");
    }

    return await inventoryRepository.decrementStock(id, quantity);
};

const getLowStockItems = async () => {
    return await inventoryRepository.getLowStockItems();
};

const getExpiringItems = async () => {
    return await inventoryRepository.getExpiringItems();
};

const deleteItem = async (id) => {
    const item = await inventoryRepository.getItemById(id);
    if (!item) {
        throw new Error("Inventory item not found");
    }

    await inventoryRepository.deleteItem(id);

    return { message: "Inventory item deleted successfully" };
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
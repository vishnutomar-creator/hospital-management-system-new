const pharmacyRepository = require("../repositories/pharmacy.repository");
const inventoryRepository = require("../repositories/pharmacyInventory.repository");

const dispenseMedicine = async (dispenseData, pharmacistId) => {
    const { itemId, quantity, prescriptionId, patientId } = dispenseData;

    const item = await inventoryRepository.getInventoryItemById(itemId);
    if (!item) {
        throw new Error("Inventory item not found");
    }

    if (item.status !== "Active") {
        throw new Error(`This item is not available for dispensing (status: ${item.status})`);
    }

    if (item.quantityInStock < quantity) {
        throw new Error(`Insufficient stock. Only ${item.quantityInStock} ${item.unit}(s) available`);
    }

    if (item.expiryDate && new Date(item.expiryDate) < new Date()) {
        throw new Error("Cannot dispense an expired item");
    }

    const totalPrice = item.unitPrice * quantity;

    const dispenseRecord = await pharmacyRepository.createDispenseRecord({
        prescriptionId,
        patientId,
        itemId,
        quantity,
        pharmacistId,
        totalPrice,
    });

    await inventoryRepository.deductStock(itemId, quantity);

    return dispenseRecord;
};

const getDispenseRecords = async () => {
    return await pharmacyRepository.getDispenseRecords();
};

const getDispenseById = async (id) => {
    const record = await pharmacyRepository.getDispenseById(id);
    if (!record) {
        throw new Error("Dispense record not found");
    }
    return record;
};

const getDispensesByPatient = async (patientId) => {
    return await pharmacyRepository.getDispensesByPatient(patientId);
};

const returnMedicine = async (id) => {
    const record = await pharmacyRepository.getDispenseById(id);
    if (!record) {
        throw new Error("Dispense record not found");
    }

    if (record.status === "Returned") {
        throw new Error("This item has already been returned");
    }

    await inventoryRepository.restoreStock(record.itemId._id || record.itemId, record.quantity);

    return await pharmacyRepository.updateDispenseStatus(id, "Returned");
};

module.exports = {
    dispenseMedicine,
    getDispenseRecords,
    getDispenseById,
    getDispensesByPatient,
    returnMedicine,
};
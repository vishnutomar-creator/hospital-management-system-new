const purchaseOrderRepository = require("../repositories/purchaseorder.repository");
const inventoryRepository = require("../repositories/inventory.repository");

const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
};

const createPO = async (poData, createdBy) => {
    const totalAmount = calculateTotal(poData.items);

    return await purchaseOrderRepository.createPO({
        ...poData,
        totalAmount,
        createdBy,
    });
};

const getPOs = async () => {
    return await purchaseOrderRepository.getPOs();
};

const getPOById = async (id) => {
    const po = await purchaseOrderRepository.getPOById(id);
    if (!po) {
        throw new Error("Purchase order not found");
    }
    return po;
};

const getPOsBySupplier = async (supplierId) => {
    return await purchaseOrderRepository.getPOsBySupplier(supplierId);
};

const approvePO = async (id) => {
    const po = await purchaseOrderRepository.getPOById(id);
    if (!po) {
        throw new Error("Purchase order not found");
    }

    if (po.status !== "Pending") {
        throw new Error("Only pending purchase orders can be approved");
    }

    return await purchaseOrderRepository.updatePO(id, { status: "Approved" });
};

const markOrdered = async (id) => {
    const po = await purchaseOrderRepository.getPOById(id);
    if (!po) {
        throw new Error("Purchase order not found");
    }

    if (po.status !== "Approved") {
        throw new Error("Only approved purchase orders can be marked as ordered");
    }

    return await purchaseOrderRepository.updatePO(id, { status: "Ordered" });
};

const receivePO = async (id) => {
    const po = await purchaseOrderRepository.getPOById(id);
    if (!po) {
        throw new Error("Purchase order not found");
    }

    if (po.status !== "Ordered") {
        throw new Error("Only ordered purchase orders can be marked as received");
    }

    // Add each item's quantity back into inventory stock
    for (const line of po.items) {
        const itemId = line.itemId._id || line.itemId;
        await inventoryRepository.incrementStock(itemId, line.quantity);
    }

    return await purchaseOrderRepository.updatePO(id, {
        status: "Received",
        receivedDate: new Date(),
    });
};

const cancelPO = async (id) => {
    const po = await purchaseOrderRepository.getPOById(id);
    if (!po) {
        throw new Error("Purchase order not found");
    }

    if (po.status === "Received") {
        throw new Error("Cannot cancel a purchase order that has already been received");
    }

    return await purchaseOrderRepository.updatePO(id, { status: "Cancelled" });
};

const deletePO = async (id) => {
    const po = await purchaseOrderRepository.getPOById(id);
    if (!po) {
        throw new Error("Purchase order not found");
    }

    if (po.status === "Received") {
        throw new Error("Cannot delete a received purchase order (has affected stock)");
    }

    await purchaseOrderRepository.deletePO(id);

    return { message: "Purchase order deleted successfully" };
};

module.exports = {
    createPO,
    getPOs,
    getPOById,
    getPOsBySupplier,
    approvePO,
    markOrdered,
    receivePO,
    cancelPO,
    deletePO,
};
const purchaseOrderService = require("../services/purchaseorder.service");

const createPO = async (req, res, next) => {
    try {
        const po = await purchaseOrderService.createPO(req.body, req.user.id);
        res.status(201).json({ success: true, message: "Purchase order created successfully", data: po });
    } catch (error) {
        next(error);
    }
};

const getPOs = async (req, res, next) => {
    try {
        const pos = await purchaseOrderService.getPOs();
        res.status(200).json({ success: true, message: "Purchase orders fetched successfully", data: pos });
    } catch (error) {
        next(error);
    }
};

const getPOById = async (req, res, next) => {
    try {
        const po = await purchaseOrderService.getPOById(req.params.id);
        res.status(200).json({ success: true, message: "Purchase order fetched successfully", data: po });
    } catch (error) {
        next(error);
    }
};

const getPOsBySupplier = async (req, res, next) => {
    try {
        const pos = await purchaseOrderService.getPOsBySupplier(req.params.supplierId);
        res.status(200).json({ success: true, message: "Purchase orders fetched successfully", data: pos });
    } catch (error) {
        next(error);
    }
};

const approvePO = async (req, res, next) => {
    try {
        const po = await purchaseOrderService.approvePO(req.params.id);
        res.status(200).json({ success: true, message: "Purchase order approved", data: po });
    } catch (error) {
        next(error);
    }
};

const markOrdered = async (req, res, next) => {
    try {
        const po = await purchaseOrderService.markOrdered(req.params.id);
        res.status(200).json({ success: true, message: "Purchase order marked as ordered", data: po });
    } catch (error) {
        next(error);
    }
};

const receivePO = async (req, res, next) => {
    try {
        const po = await purchaseOrderService.receivePO(req.params.id);
        res.status(200).json({ success: true, message: "Purchase order received, stock updated", data: po });
    } catch (error) {
        next(error);
    }
};

const cancelPO = async (req, res, next) => {
    try {
        const po = await purchaseOrderService.cancelPO(req.params.id);
        res.status(200).json({ success: true, message: "Purchase order cancelled", data: po });
    } catch (error) {
        next(error);
    }
};

const deletePO = async (req, res, next) => {
    try {
        const result = await purchaseOrderService.deletePO(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        next(error);
    }
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
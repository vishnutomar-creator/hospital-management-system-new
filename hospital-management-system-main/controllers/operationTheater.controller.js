const otService = require("../services/operationtheater.service");

const createOT = async (req, res, next) => {
    try {
        const ot = await otService.createOT(req.body);
        res.status(201).json({ success: true, message: "Operation Theater created successfully", data: ot });
    } catch (error) {
        next(error);
    }
};

const getOTs = async (req, res, next) => {
    try {
        const ots = await otService.getOTs();
        res.status(200).json({ success: true, message: "Operation Theaters fetched successfully", data: ots });
    } catch (error) {
        next(error);
    }
};

const getOTById = async (req, res, next) => {
    try {
        const ot = await otService.getOTById(req.params.id);
        res.status(200).json({ success: true, message: "Operation Theater fetched successfully", data: ot });
    } catch (error) {
        next(error);
    }
};

const updateOT = async (req, res, next) => {
    try {
        const ot = await otService.updateOT(req.params.id, req.body);
        res.status(200).json({ success: true, message: "Operation Theater updated successfully", data: ot });
    } catch (error) {
        next(error);
    }
};

const setUnderMaintenance = async (req, res, next) => {
    try {
        const ot = await otService.setUnderMaintenance(req.params.id);
        res.status(200).json({ success: true, message: "OT marked under maintenance", data: ot });
    } catch (error) {
        next(error);
    }
};

const setAvailable = async (req, res, next) => {
    try {
        const ot = await otService.setAvailable(req.params.id);
        res.status(200).json({ success: true, message: "OT marked available", data: ot });
    } catch (error) {
        next(error);
    }
};

const deleteOT = async (req, res, next) => {
    try {
        const result = await otService.deleteOT(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        next(error);
    }
};

const getAvailableOTsForDate = async (req, res, next) => {
    try {
        const { date } = req.query;
        const ots = await otService.getAvailableOTsForDate(date);
        res.status(200).json({ success: true, message: "Available OTs fetched successfully", data: ots });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOT,
    getOTs,
    getOTById,
    updateOT,
    setUnderMaintenance,
    setAvailable,
    deleteOT,
    getAvailableOTsForDate,
};
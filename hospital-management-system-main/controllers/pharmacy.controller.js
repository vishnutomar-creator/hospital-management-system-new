const pharmacyService = require("../services/pharmacy.service");

const dispenseMedicine = async (req, res, next) => {
    try {
        const record = await pharmacyService.dispenseMedicine(req.body, req.user.id);
        res.status(201).json({ success: true, message: "Medicine dispensed successfully", data: record });
    } catch (error) {
        next(error);
    }
};

const getDispenseRecords = async (req, res, next) => {
    try {
        const records = await pharmacyService.getDispenseRecords();
        res.status(200).json({ success: true, message: "Dispense records fetched successfully", data: records });
    } catch (error) {
        next(error);
    }
};

const getDispenseById = async (req, res, next) => {
    try {
        const record = await pharmacyService.getDispenseById(req.params.id);
        res.status(200).json({ success: true, message: "Dispense record fetched successfully", data: record });
    } catch (error) {
        next(error);
    }
};

const getDispensesByPatient = async (req, res, next) => {
    try {
        const records = await pharmacyService.getDispensesByPatient(req.params.patientId);
        res.status(200).json({ success: true, message: "Dispense records fetched successfully", data: records });
    } catch (error) {
        next(error);
    }
};

const returnMedicine = async (req, res, next) => {
    try {
        const record = await pharmacyService.returnMedicine(req.params.id);
        res.status(200).json({ success: true, message: "Medicine return processed successfully", data: record });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    dispenseMedicine,
    getDispenseRecords,
    getDispenseById,
    getDispensesByPatient,
    returnMedicine,
};
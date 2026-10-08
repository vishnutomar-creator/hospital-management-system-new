const bedService = require("../services/bed.service");

const createBed = async (req, res, next) => {
    try {
        const bed = await bedService.createBed(req.body);
        res.status(201).json({ success: true, message: "Bed created successfully", data: bed });
    } catch (error) {
        next(error);
    }
};

const getBeds = async (req, res, next) => {
    try {
        const beds = await bedService.getBeds();
        res.status(200).json({ success: true, message: "Beds fetched successfully", data: beds });
    } catch (error) {
        next(error);
    }
};

const getBedById = async (req, res, next) => {
    try {
        const bed = await bedService.getBedById(req.params.id);
        res.status(200).json({ success: true, message: "Bed fetched successfully", data: bed });
    } catch (error) {
        next(error);
    }
};

const updateBed = async (req, res, next) => {
    try {
        const bed = await bedService.updateBed(req.params.id, req.body);
        res.status(200).json({ success: true, message: "Bed updated successfully", data: bed });
    } catch (error) {
        next(error);
    }
};

const allocateBed = async (req, res, next) => {
    try {
        const { patientId, admissionId } = req.body;
        const bed = await bedService.allocateBed(req.params.id, patientId, admissionId);
        res.status(200).json({ success: true, message: "Bed allocated successfully", data: bed });
    } catch (error) {
        next(error);
    }
};

const releaseBed = async (req, res, next) => {
    try {
        const bed = await bedService.releaseBed(req.params.id);
        res.status(200).json({ success: true, message: "Bed released successfully", data: bed });
    } catch (error) {
        next(error);
    }
};

const deleteBed = async (req, res, next) => {
    try {
        const result = await bedService.deleteBed(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBed,
    getBeds,
    getBedById,
    updateBed,
    allocateBed,
    releaseBed,
    deleteBed,
};
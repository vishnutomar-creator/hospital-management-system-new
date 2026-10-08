const surgeryService = require("../services/surgery.service");

const createSurgery = async (req, res, next) => {
    try {
        const surgery = await surgeryService.createSurgery(req.body);

        res.status(201).json({
            success: true,
            message: "Surgery scheduled successfully",
            data: surgery,
        });
    } catch (error) {
        next(error);
    }
};

const getSurgeries = async (req, res, next) => {
    try {
        const surgeries = await surgeryService.getSurgeries();

        res.status(200).json({
            success: true,
            message: "Surgeries fetched successfully",
            data: surgeries,
        });
    } catch (error) {
        next(error);
    }
};

const getSurgeryById = async (req, res, next) => {
    try {
        const surgery = await surgeryService.getSurgeryById(req.params.id);

        res.status(200).json({
            success: true,
            message: "Surgery fetched successfully",
            data: surgery,
        });
    } catch (error) {
        next(error);
    }
};

const updateSurgery = async (req, res, next) => {
    try {
        const surgery = await surgeryService.updateSurgery(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: "Surgery updated successfully",
            data: surgery,
        });
    } catch (error) {
        next(error);
    }
};

const deleteSurgery = async (req, res, next) => {
    try {
        const result = await surgeryService.deleteSurgery(req.params.id);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSurgery,
    getSurgeries,
    getSurgeryById,
    updateSurgery,
    deleteSurgery,
};
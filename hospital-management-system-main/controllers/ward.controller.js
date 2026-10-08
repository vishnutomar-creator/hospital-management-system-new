const wardService = require("../services/ward.service");

const createWard = async (req, res, next) => {
    try {
        const ward = await wardService.createWard(req.body);

        res.status(201).json({
            success: true,
            message: "Ward created successfully",
            data: ward,
        });
    } catch (error) {
        next(error);
    }
};

const getWards = async (req, res, next) => {
    try {
        const wards = await wardService.getWards();

        res.status(200).json({
            success: true,
            message: "Wards fetched successfully",
            data: wards,
        });
    } catch (error) {
        next(error);
    }
};

const getWardById = async (req, res, next) => {
    try {
        const ward = await wardService.getWardById(req.params.id);

        res.status(200).json({
            success: true,
            message: "Ward fetched successfully",
            data: ward,
        });
    } catch (error) {
        next(error);
    }
};

const updateWard = async (req, res, next) => {
    try {
        const ward = await wardService.updateWard(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: "Ward updated successfully",
            data: ward,
        });
    } catch (error) {
        next(error);
    }
};

const deleteWard = async (req, res, next) => {
    try {
        const result = await wardService.deleteWard(req.params.id);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createWard,
    getWards,
    getWardById,
    updateWard,
    deleteWard,
};
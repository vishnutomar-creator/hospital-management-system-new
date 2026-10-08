const nurseService = require("../services/nurses.repository");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const createNurse = async (req, res, next) => {
    try {
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "hms/nurses" });
            req.body.profileImage = result.secure_url;
            fs.unlinkSync(req.file.path);
        }

        const nurse = await nurseService.createNurse(req.body);

        res.status(201).json({ success: true, message: "Nurse created successfully", data: nurse });
    } catch (error) {
        next(error);
    }
};

const getNurses = async (req, res, next) => {
    try {
        const nurses = await nurseService.getNurses();
        res.status(200).json({ success: true, message: "Nurses fetched successfully", data: nurses });
    } catch (error) {
        next(error);
    }
};

const getNurseById = async (req, res, next) => {
    try {
        const nurse = await nurseService.getNurseById(req.params.id);
        res.status(200).json({ success: true, message: "Nurse fetched successfully", data: nurse });
    } catch (error) {
        next(error);
    }
};

const updateNurse = async (req, res, next) => {
    try {
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "hms/nurses" });
            req.body.profileImage = result.secure_url;
            fs.unlinkSync(req.file.path);
        }

        const nurse = await nurseService.updateNurse(req.params.id, req.body);
        res.status(200).json({ success: true, message: "Nurse updated successfully", data: nurse });
    } catch (error) {
        next(error);
    }
};

const deleteNurse = async (req, res, next) => {
    try {
        const result = await nurseService.deleteNurse(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        next(error);
    }
};

const getNursesByWard = async (req, res, next) => {
    try {
        const nurses = await nurseService.getNursesByWard(req.params.wardId);
        res.status(200).json({ success: true, message: "Nurses fetched successfully", data: nurses });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createNurse,
    getNurses,
    getNurseById,
    updateNurse,
    deleteNurse,
    getNursesByWard,
};
const radiologyService = require("../services/radiology.service");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const orderScan = async (req, res, next) => {
    try {
        const scan = await radiologyService.orderScan(req.body);
        res.status(201).json({ success: true, message: "Radiology scan ordered successfully", data: scan });
    } catch (error) {
        next(error);
    }
};

const getScans = async (req, res, next) => {
    try {
        const scans = await radiologyService.getScans();
        res.status(200).json({ success: true, message: "Radiology scans fetched successfully", data: scans });
    } catch (error) {
        next(error);
    }
};

const getScanById = async (req, res, next) => {
    try {
        const scan = await radiologyService.getScanById(req.params.id);
        res.status(200).json({ success: true, message: "Radiology scan fetched successfully", data: scan });
    } catch (error) {
        next(error);
    }
};

const getScansByPatient = async (req, res, next) => {
    try {
        const scans = await radiologyService.getScansByPatient(req.params.patientId);
        res.status(200).json({ success: true, message: "Radiology scans fetched successfully", data: scans });
    } catch (error) {
        next(error);
    }
};

const getPendingScans = async (req, res, next) => {
    try {
        const scans = await radiologyService.getPendingScans();
        res.status(200).json({ success: true, message: "Pending scans fetched successfully", data: scans });
    } catch (error) {
        next(error);
    }
};

const scheduleScan = async (req, res, next) => {
    try {
        const { scanDate } = req.body;
        const scan = await radiologyService.scheduleScan(req.params.id, scanDate);
        res.status(200).json({ success: true, message: "Scan scheduled successfully", data: scan });
    } catch (error) {
        next(error);
    }
};

const startScan = async (req, res, next) => {
    try {
        const scan = await radiologyService.startScan(req.params.id);
        res.status(200).json({ success: true, message: "Scan marked as in-progress", data: scan });
    } catch (error) {
        next(error);
    }
};

const submitReport = async (req, res, next) => {
    try {
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "hms/radiology-reports",
                resource_type: "auto",
            });
            req.body.reportFile = result.secure_url;
            fs.unlinkSync(req.file.path);
        }

        const scan = await radiologyService.submitReport(req.params.id, req.body);
        res.status(200).json({ success: true, message: "Report submitted successfully", data: scan });
    } catch (error) {
        next(error);
    }
};

const verifyReport = async (req, res, next) => {
    try {
        const { verifiedBy } = req.body;
        const scan = await radiologyService.verifyReport(req.params.id, verifiedBy);
        res.status(200).json({ success: true, message: "Report verified successfully", data: scan });
    } catch (error) {
        next(error);
    }
};

const cancelScan = async (req, res, next) => {
    try {
        const scan = await radiologyService.cancelScan(req.params.id);
        res.status(200).json({ success: true, message: "Scan cancelled", data: scan });
    } catch (error) {
        next(error);
    }
};

const deleteScan = async (req, res, next) => {
    try {
        const result = await radiologyService.deleteScan(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    orderScan,
    getScans,
    getScanById,
    getScansByPatient,
    getPendingScans,
    scheduleScan,
    startScan,
    submitReport,
    verifyReport,
    cancelScan,
    deleteScan,
};
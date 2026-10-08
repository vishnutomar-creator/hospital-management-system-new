const labTestService = require("../services/labtest.service");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const orderLabTest = async (req, res, next) => {
    try {
        const test = await labTestService.orderLabTest(req.body);
        res.status(201).json({ success: true, message: "Lab test ordered successfully", data: test });
    } catch (error) {
        next(error);
    }
};

const getLabTests = async (req, res, next) => {
    try {
        const tests = await labTestService.getLabTests();
        res.status(200).json({ success: true, message: "Lab tests fetched successfully", data: tests });
    } catch (error) {
        next(error);
    }
};

const getLabTestById = async (req, res, next) => {
    try {
        const test = await labTestService.getLabTestById(req.params.id);
        res.status(200).json({ success: true, message: "Lab test fetched successfully", data: test });
    } catch (error) {
        next(error);
    }
};

const getLabTestsByPatient = async (req, res, next) => {
    try {
        const tests = await labTestService.getLabTestsByPatient(req.params.patientId);
        res.status(200).json({ success: true, message: "Lab tests fetched successfully", data: tests });
    } catch (error) {
        next(error);
    }
};

const getPendingLabTests = async (req, res, next) => {
    try {
        const tests = await labTestService.getPendingLabTests();
        res.status(200).json({ success: true, message: "Pending lab tests fetched successfully", data: tests });
    } catch (error) {
        next(error);
    }
};

const collectSample = async (req, res, next) => {
    try {
        const test = await labTestService.collectSample(req.params.id);
        res.status(200).json({ success: true, message: "Sample marked as collected", data: test });
    } catch (error) {
        next(error);
    }
};

const startProcessing = async (req, res, next) => {
    try {
        const test = await labTestService.startProcessing(req.params.id);
        res.status(200).json({ success: true, message: "Test marked as in-progress", data: test });
    } catch (error) {
        next(error);
    }
};

const submitResult = async (req, res, next) => {
    try {
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "hms/lab-reports",
                resource_type: "auto",
            });
            req.body.reportFile = result.secure_url;
            fs.unlinkSync(req.file.path);
        }

        const test = await labTestService.submitResult(req.params.id, req.body);
        res.status(200).json({ success: true, message: "Result submitted successfully", data: test });
    } catch (error) {
        next(error);
    }
};

const verifyResult = async (req, res, next) => {
    try {
        const verifiedBy = req.body.verifiedBy || req.user?._id;
        const test = await labTestService.verifyResult(req.params.id, verifiedBy);
        res.status(200).json({ success: true, message: "Result verified successfully", data: test });
    } catch (error) {
        next(error);
    }
};

const cancelLabTest = async (req, res, next) => {
    try {
        const test = await labTestService.cancelLabTest(req.params.id);
        res.status(200).json({ success: true, message: "Lab test cancelled", data: test });
    } catch (error) {
        next(error);
    }
};

const deleteLabTest = async (req, res, next) => {
    try {
        const result = await labTestService.deleteLabTest(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    orderLabTest,
    getLabTests,
    getLabTestById,
    getLabTestsByPatient,
    getPendingLabTests,
    collectSample,
    startProcessing,
    submitResult,
    verifyResult,
    cancelLabTest,
    deleteLabTest,
};
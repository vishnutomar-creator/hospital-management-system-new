const insuranceClaimService = require("../services/insuranceclaim.service");

const submitClaim = async (req, res, next) => {
    try {
        const claim = await insuranceClaimService.submitClaim(req.body, req.user.id);
        res.status(201).json({ success: true, message: "Insurance claim submitted successfully", data: claim });
    } catch (error) {
        next(error);
    }
};

const getClaims = async (req, res, next) => {
    try {
        const claims = await insuranceClaimService.getClaims();
        res.status(200).json({ success: true, message: "Insurance claims fetched successfully", data: claims });
    } catch (error) {
        next(error);
    }
};

const getClaimById = async (req, res, next) => {
    try {
        const claim = await insuranceClaimService.getClaimById(req.params.id);
        res.status(200).json({ success: true, message: "Insurance claim fetched successfully", data: claim });
    } catch (error) {
        next(error);
    }
};

const getClaimsByPatient = async (req, res, next) => {
    try {
        const claims = await insuranceClaimService.getClaimsByPatient(req.params.patientId);
        res.status(200).json({ success: true, message: "Insurance claims fetched successfully", data: claims });
    } catch (error) {
        next(error);
    }
};

const startReview = async (req, res, next) => {
    try {
        const claim = await insuranceClaimService.startReview(req.params.id);
        res.status(200).json({ success: true, message: "Claim moved to review", data: claim });
    } catch (error) {
        next(error);
    }
};

const approveClaim = async (req, res, next) => {
    try {
        const { approvedAmount } = req.body;
        const claim = await insuranceClaimService.approveClaim(req.params.id, approvedAmount);
        res.status(200).json({ success: true, message: "Claim approved", data: claim });
    } catch (error) {
        next(error);
    }
};

const rejectClaim = async (req, res, next) => {
    try {
        const { rejectionReason } = req.body;
        const claim = await insuranceClaimService.rejectClaim(req.params.id, rejectionReason);
        res.status(200).json({ success: true, message: "Claim rejected", data: claim });
    } catch (error) {
        next(error);
    }
};

const settleClaim = async (req, res, next) => {
    try {
        const claim = await insuranceClaimService.settleClaim(req.params.id);
        res.status(200).json({ success: true, message: "Claim settled successfully", data: claim });
    } catch (error) {
        next(error);
    }
};

const deleteClaim = async (req, res, next) => {
    try {
        const result = await insuranceClaimService.deleteClaim(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    submitClaim,
    getClaims,
    getClaimById,
    getClaimsByPatient,
    startReview,
    approveClaim,
    rejectClaim,
    settleClaim,
    deleteClaim,
};
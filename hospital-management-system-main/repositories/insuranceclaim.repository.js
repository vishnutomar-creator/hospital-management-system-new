const InsuranceClaim = require("../models/insuranceclaim");

const createClaim = async (claimData) => {
    return await InsuranceClaim.create(claimData);
};

const getClaims = async () => {
    return await InsuranceClaim.find()
        .populate("patientId", "name patientName patientId phone")
        .sort({ submittedDate: -1 });
};

const getClaimById = async (id) => {
    return await InsuranceClaim.findById(id).populate("patientId", "name patientName patientId phone");
};

const getClaimsByPatient = async (patientId) => {
    return await InsuranceClaim.find({ patientId }).sort({ submittedDate: -1 });
};

const getClaimsByStatus = async (status) => {
    return await InsuranceClaim.find({ status })
        .populate("patientId", "name patientName patientId phone")
        .sort({ submittedDate: -1 });
};

const updateClaim = async (id, updateData) => {
    return await InsuranceClaim.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
};

const deleteClaim = async (id) => {
    return await InsuranceClaim.findByIdAndDelete(id);
};

module.exports = {
    createClaim,
    getClaims,
    getClaimById,
    getClaimsByPatient,
    getClaimsByStatus,
    updateClaim,
    deleteClaim,
};
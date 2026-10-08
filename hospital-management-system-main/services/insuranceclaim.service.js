const insuranceClaimRepository = require("../repositories/insuranceclaim.repository");

const submitClaim = async (claimData, createdBy) => {
    return await insuranceClaimRepository.createClaim({ ...claimData, createdBy });
};

const getClaims = async () => {
    return await insuranceClaimRepository.getClaims();
};

const getClaimById = async (id) => {
    const claim = await insuranceClaimRepository.getClaimById(id);
    if (!claim) {
        throw new Error("Insurance claim not found");
    }
    return claim;
};

const getClaimsByPatient = async (patientId) => {
    return await insuranceClaimRepository.getClaimsByPatient(patientId);
};

const startReview = async (id) => {
    const claim = await insuranceClaimRepository.getClaimById(id);
    if (!claim) {
        throw new Error("Insurance claim not found");
    }

    if (claim.status !== "Submitted") {
        throw new Error("Only submitted claims can be moved to review");
    }

    return await insuranceClaimRepository.updateClaim(id, { status: "UnderReview" });
};

const approveClaim = async (id, approvedAmount) => {
    const claim = await insuranceClaimRepository.getClaimById(id);
    if (!claim) {
        throw new Error("Insurance claim not found");
    }

    if (claim.status !== "UnderReview") {
        throw new Error("Only claims under review can be approved");
    }

    if (approvedAmount > claim.claimAmount) {
        throw new Error("Approved amount cannot exceed the claimed amount");
    }

    return await insuranceClaimRepository.updateClaim(id, {
        status: "Approved",
        approvedAmount,
        decisionDate: new Date(),
    });
};

const rejectClaim = async (id, rejectionReason) => {
    const claim = await insuranceClaimRepository.getClaimById(id);
    if (!claim) {
        throw new Error("Insurance claim not found");
    }

    if (claim.status !== "UnderReview") {
        throw new Error("Only claims under review can be rejected");
    }

    return await insuranceClaimRepository.updateClaim(id, {
        status: "Rejected",
        rejectionReason,
        decisionDate: new Date(),
    });
};

const settleClaim = async (id) => {
    const claim = await insuranceClaimRepository.getClaimById(id);
    if (!claim) {
        throw new Error("Insurance claim not found");
    }

    if (claim.status !== "Approved") {
        throw new Error("Only approved claims can be settled");
    }

    return await insuranceClaimRepository.updateClaim(id, {
        status: "Settled",
        settledDate: new Date(),
    });
};

const deleteClaim = async (id) => {
    const claim = await insuranceClaimRepository.getClaimById(id);
    if (!claim) {
        throw new Error("Insurance claim not found");
    }

    if (claim.status === "Settled") {
        throw new Error("Cannot delete a settled claim");
    }

    await insuranceClaimRepository.deleteClaim(id);

    return { message: "Insurance claim deleted successfully" };
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
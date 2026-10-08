const radiologyRepository = require("../repositories/radiology.repository");

const orderScan = async (scanData) => {
    return await radiologyRepository.createScan(scanData);
};

const getScans = async () => {
    return await radiologyRepository.getScans();
};

const getScanById = async (id) => {
    const scan = await radiologyRepository.getScanById(id);
    if (!scan) {
        throw new Error("Radiology scan not found");
    }
    return scan;
};

const getScansByPatient = async (patientId) => {
    return await radiologyRepository.getScansByPatient(patientId);
};

const getPendingScans = async () => {
    return await radiologyRepository.getScansByStatus("Ordered");
};

const scheduleScan = async (id, scanDate) => {
    const scan = await radiologyRepository.getScanById(id);
    if (!scan) {
        throw new Error("Radiology scan not found");
    }

    if (scan.status !== "Ordered") {
        throw new Error("Only ordered scans can be scheduled");
    }

    return await radiologyRepository.updateScan(id, { status: "Scheduled", scanDate });
};

const startScan = async (id) => {
    const scan = await radiologyRepository.getScanById(id);
    if (!scan) {
        throw new Error("Radiology scan not found");
    }

    if (scan.status !== "Scheduled") {
        throw new Error("Scan must be scheduled before it can be started");
    }

    return await radiologyRepository.updateScan(id, { status: "InProgress" });
};

const submitReport = async (id, reportData) => {
    const scan = await radiologyRepository.getScanById(id);
    if (!scan) {
        throw new Error("Radiology scan not found");
    }

    if (!["InProgress", "Scheduled"].includes(scan.status)) {
        throw new Error("Report can only be submitted for a scheduled/in-progress scan");
    }

    return await radiologyRepository.updateScan(id, {
        ...reportData,
        status: "Completed",
    });
};

const verifyReport = async (id, verifiedByDoctorId) => {
    const scan = await radiologyRepository.getScanById(id);
    if (!scan) {
        throw new Error("Radiology scan not found");
    }

    if (scan.status !== "Completed") {
        throw new Error("Only completed scans can be verified");
    }

    return await radiologyRepository.updateScan(id, { verifiedBy: verifiedByDoctorId });
};

const cancelScan = async (id) => {
    const scan = await radiologyRepository.getScanById(id);
    if (!scan) {
        throw new Error("Radiology scan not found");
    }

    if (scan.status === "Completed") {
        throw new Error("Cannot cancel a completed scan");
    }

    return await radiologyRepository.updateScan(id, { status: "Cancelled" });
};

const deleteScan = async (id) => {
    const scan = await radiologyRepository.getScanById(id);
    if (!scan) {
        throw new Error("Radiology scan not found");
    }

    await radiologyRepository.deleteScan(id);

    return { message: "Radiology scan deleted successfully" };
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
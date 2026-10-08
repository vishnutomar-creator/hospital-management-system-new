const labTestRepository = require("../repositories/labtest.repository");

const orderLabTest = async (labTestData) => {
    return await labTestRepository.createLabTest(labTestData);
};

const getLabTests = async () => {
    return await labTestRepository.getLabTests();
};

const getLabTestById = async (id) => {
    const test = await labTestRepository.getLabTestById(id);
    if (!test) {
        throw new Error("Lab test not found");
    }
    return test;
};

const getLabTestsByPatient = async (patientId) => {
    return await labTestRepository.getLabTestsByPatient(patientId);
};

const getPendingLabTests = async () => {
    return await labTestRepository.getLabTestsByStatus("Ordered");
};

const collectSample = async (id) => {
    const test = await labTestRepository.getLabTestById(id);
    if (!test) {
        throw new Error("Lab test not found");
    }

    if (test.status !== "Ordered") {
        throw new Error("Sample can only be collected for an ordered test");
    }

    return await labTestRepository.updateLabTest(id, {
        status: "SampleCollected",
        sampleCollectedAt: new Date(),
    });
};

const startProcessing = async (id) => {
    const test = await labTestRepository.getLabTestById(id);
    if (!test) {
        throw new Error("Lab test not found");
    }

    if (test.status !== "SampleCollected") {
        throw new Error("Test must have sample collected before processing");
    }

    return await labTestRepository.updateLabTest(id, { status: "InProgress" });
};

const submitResult = async (id, resultData) => {
    const test = await labTestRepository.getLabTestById(id);
    if (!test) {
        throw new Error("Lab test not found");
    }

    if (!["InProgress", "SampleCollected"].includes(test.status)) {
        throw new Error("Result can only be submitted for a sample already collected/in-progress test");
    }

    return await labTestRepository.updateLabTest(id, {
        ...resultData,
        status: "Completed",
        resultDate: new Date(),
    });
};

const verifyResult = async (id, verifiedByDoctorId) => {
    const test = await labTestRepository.getLabTestById(id);
    if (!test) {
        throw new Error("Lab test not found");
    }

    return await labTestRepository.updateLabTest(id, {
        verifiedBy: verifiedByDoctorId,
        status: "Completed",
        resultDate: test.resultDate || new Date(),
    });
};

const cancelLabTest = async (id) => {
    const test = await labTestRepository.getLabTestById(id);
    if (!test) {
        throw new Error("Lab test not found");
    }

    if (test.status === "Completed") {
        throw new Error("Cannot cancel a completed test");
    }

    return await labTestRepository.updateLabTest(id, { status: "Cancelled" });
};

const deleteLabTest = async (id) => {
    const test = await labTestRepository.getLabTestById(id);
    if (!test) {
        throw new Error("Lab test not found");
    }

    await labTestRepository.deleteLabTest(id);

    return { message: "Lab test deleted successfully" };
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
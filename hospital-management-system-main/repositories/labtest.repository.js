const LabTest = require("../models/labtest");

const createLabTest = async (labTestData) => {
    return await LabTest.create(labTestData);
};

const getLabTests = async () => {
    return await LabTest.find()
        .populate("patientId", "name patientName patientId phone gender age")
        .populate("doctorId", "name doctorId specialization qualification")
        .populate("verifiedBy", "name doctorId specialization")
        .sort({ createdAt: -1 });
};

const getLabTestById = async (id) => {
    return await LabTest.findById(id)
        .populate("patientId", "name patientName patientId phone gender age")
        .populate("doctorId", "name doctorId specialization qualification")
        .populate("verifiedBy", "name doctorId specialization");
};

const getLabTestsByPatient = async (patientId) => {
    return await LabTest.find({ patientId })
        .populate("doctorId", "name doctorId specialization qualification")
        .sort({ orderDate: -1 });
};

const getLabTestsByStatus = async (status) => {
    return await LabTest.find({ status })
        .populate("patientId", "name patientName patientId phone gender age")
        .populate("doctorId", "name doctorId specialization qualification")
        .sort({ priority: 1, orderDate: 1 });
};

const updateLabTest = async (id, updateData) => {
    return await LabTest.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
};

const deleteLabTest = async (id) => {
    return await LabTest.findByIdAndDelete(id);
};

module.exports = {
    createLabTest,
    getLabTests,
    getLabTestById,
    getLabTestsByPatient,
    getLabTestsByStatus,
    updateLabTest,
    deleteLabTest,
};
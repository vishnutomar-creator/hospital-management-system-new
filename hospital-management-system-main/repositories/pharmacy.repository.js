const PharmacyDispense = require("../models/pharmacydispense");

const createDispenseRecord = async (dispenseData) => {
    return await PharmacyDispense.create(dispenseData);
};

const getDispenseRecords = async () => {
    return await PharmacyDispense.find()
        .populate("patientId", "name patientName patientId phone")
        .populate("itemId", "itemName unit")
        .populate("prescriptionId", "medicineName dosage")
        .sort({ dispenseDate: -1 });
};

const getDispenseById = async (id) => {
    return await PharmacyDispense.findById(id)
        .populate("patientId", "name patientName patientId phone")
        .populate("itemId", "itemName unit")
        .populate("prescriptionId", "medicineName dosage");
};

const getDispensesByPrescription = async (prescriptionId) => {
    return await PharmacyDispense.find({ prescriptionId });
};

const getDispensesByPatient = async (patientId) => {
    return await PharmacyDispense.find({ patientId })
        .populate("itemId", "itemName unit")
        .sort({ dispenseDate: -1 });
};

const updateDispenseStatus = async (id, status) => {
    return await PharmacyDispense.findByIdAndUpdate(id, { status }, { new: true });
};

module.exports = {
    createDispenseRecord,
    getDispenseRecords,
    getDispenseById,
    getDispensesByPrescription,
    getDispensesByPatient,
    updateDispenseStatus,
};
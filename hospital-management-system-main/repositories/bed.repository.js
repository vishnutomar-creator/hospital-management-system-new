const Bed = require("../models/bed");

const createBed = async (bedData) => {
    return await Bed.create(bedData);
};

const getBeds = async () => {
    return await Bed.find()
        .populate("wardId", "wardName wardType floor")
        .populate("currentPatientId", "name patientName patientId phone")
        .sort({ createdAt: -1 });
};

const getBedById = async (id) => {
    return await Bed.findById(id)
        .populate("wardId", "wardName wardType floor")
        .populate("currentPatientId", "name patientName patientId phone");
};

const getBedsByWard = async (wardId) => {
    return await Bed.find({ wardId }).populate("currentPatientId", "name patientName patientId phone");
};

const countBedsInWard = async (wardId) => {
    return await Bed.countDocuments({ wardId });
};

const getBedByNumberInWard = async (wardId, bedNumber) => {
    return await Bed.findOne({ wardId, bedNumber });
};

const updateBed = async (id, bedData) => {
    return await Bed.findByIdAndUpdate(id, bedData, {
        returnDocument: "after",
        runValidators: true,
    });
};

const deleteBed = async (id) => {
    return await Bed.findByIdAndDelete(id);
};

module.exports = {
    createBed,
    getBeds,
    getBedById,
    getBedsByWard,
    countBedsInWard,
    getBedByNumberInWard,
    updateBed,
    deleteBed,
};
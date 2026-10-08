const Ward = require("../models/ward");

const createWard = async (wardData) => {
    return await Ward.create(wardData);
};

const getWards = async () => {
    return await Ward.find()
        .populate("departmentId", "name departmentId description")
        .populate("inChargeNurseId", "name nurseId phone")
        .sort({ createdAt: -1 });
};

const getWardById = async (id) => {
    return await Ward.findById(id)
        .populate("departmentId", "name departmentId description")
        .populate("inChargeNurseId", "name nurseId phone");
};

const getWardByName = async (wardName) => {
    return await Ward.findOne({ wardName });
};

const updateWard = async (id, wardData) => {
    return await Ward.findByIdAndUpdate(id, wardData, {
        new: true,
        runValidators: true,
    });
};

const incrementAvailableBeds = async (id, count = 1) => {
    return await Ward.findByIdAndUpdate(
        id,
        { $inc: { availableBeds: count } },
        { new: true }
    );
};

const decrementAvailableBeds = async (id, count = 1) => {
    return await Ward.findByIdAndUpdate(
        id,
        { $inc: { availableBeds: -count } },
        { new: true }
    );
};

const deleteWard = async (id) => {
    return await Ward.findByIdAndDelete(id);
};

module.exports = {
    createWard,
    getWards,
    getWardById,
    getWardByName,
    updateWard,
    incrementAvailableBeds,
    decrementAvailableBeds,
    deleteWard,
};
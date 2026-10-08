const Nurse = require("../models/nurses");

const createNurse = async (nurseData) => {
    return await Nurse.create(nurseData);
};

const getNurses = async () => {
    return await Nurse.find()
        .select("-password")
        .populate("departmentId", "DepartmentName")
        .populate("wardId", "wardName wardType")
        .sort({ createdAt: -1 });
};

const getNurseById = async (id) => {
    return await Nurse.findById(id)
        .select("-password")
        .populate("departmentId", "DepartmentName")
        .populate("wardId", "wardName wardType");
};

const getNurseByEmail = async (email) => {
    return await Nurse.findOne({ email });
};

const getNurseByLicense = async (licenseNumber) => {
    return await Nurse.findOne({ licenseNumber });
};

const getNursesByWard = async (wardId) => {
    return await Nurse.find({ wardId, status: "Active" }).select("-password");
};

const updateNurse = async (id, nurseData) => {
    return await Nurse.findByIdAndUpdate(id, nurseData, {
        new: true,
        runValidators: true,
    }).select("-password");
};

const deleteNurse = async (id) => {
    return await Nurse.findByIdAndUpdate(id, { status: "Inactive" }, { new: true }).select("-password");
};

module.exports = {
    createNurse,
    getNurses,
    getNurseById,
    getNurseByEmail,
    getNurseByLicense,
    getNursesByWard,
    updateNurse,
    deleteNurse,
};
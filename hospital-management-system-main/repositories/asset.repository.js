const Asset = require("../models/asset");
const Maintenance = require("../models/maintanence");

const createAsset = async (assetData) => {
    return await Asset.create(assetData);
};

const getAssets = async () => {
    return await Asset.find().sort({ createdAt: -1 });
};

const getAssetById = async (id) => {
    return await Asset.findById(id);
};

const updateAsset = async (id, assetData) => {
    return await Asset.findByIdAndUpdate(id, assetData, { new: true, runValidators: true });
};

const deleteAsset = async (id) => {
    return await Asset.findByIdAndDelete(id);
};

const getAssetsNearingWarrantyExpiry = async (daysAhead = 30) => {
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + daysAhead);

    return await Asset.find({
        warrantyExpiry: { $gte: now, $lte: future },
        status: { $ne: "Retired" },
    });
};

const createMaintenance = async (maintenanceData) => {
    return await Maintenance.create(maintenanceData);
};

const getMaintenanceRecords = async () => {
    return await Maintenance.find().populate("assetId", "assetName category").sort({ maintenanceDate: -1 });
};

const getMaintenanceById = async (id) => {
    return await Maintenance.findById(id).populate("assetId", "assetName category");
};

const getMaintenanceByAsset = async (assetId) => {
    return await Maintenance.find({ assetId }).sort({ maintenanceDate: -1 });
};

const getUpcomingMaintenance = async (daysAhead = 30) => {
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + daysAhead);

    return await Maintenance.find({
        nextDueDate: { $gte: now, $lte: future },
    }).populate("assetId", "assetName category");
};

module.exports = {
    createAsset,
    getAssets,
    getAssetById,
    updateAsset,
    deleteAsset,
    getAssetsNearingWarrantyExpiry,
    createMaintenance,
    getMaintenanceRecords,
    getMaintenanceById,
    getMaintenanceByAsset,
    getUpcomingMaintenance,
};
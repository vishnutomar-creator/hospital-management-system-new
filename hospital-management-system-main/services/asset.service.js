const assetRepository = require("../repositories/asset.repository");

const createAsset = async (assetData, createdBy) => {
    return await assetRepository.createAsset({ ...assetData, createdBy });
};

const getAssets = async () => {
    return await assetRepository.getAssets();
};

const getAssetById = async (id) => {
    const asset = await assetRepository.getAssetById(id);
    if (!asset) {
        throw new Error("Asset not found");
    }
    return asset;
};

const updateAsset = async (id, assetData) => {
    const asset = await assetRepository.getAssetById(id);
    if (!asset) {
        throw new Error("Asset not found");
    }
    return await assetRepository.updateAsset(id, assetData);
};

const retireAsset = async (id) => {
    const asset = await assetRepository.getAssetById(id);
    if (!asset) {
        throw new Error("Asset not found");
    }
    if (asset.status === "Retired") {
        throw new Error("Asset is already retired");
    }
    return await assetRepository.updateAsset(id, { status: "Retired" });
};

const deleteAsset = async (id) => {
    const asset = await assetRepository.getAssetById(id);
    if (!asset) {
        throw new Error("Asset not found");
    }
    await assetRepository.deleteAsset(id);
    return { message: "Asset deleted successfully" };
};

const getAssetsNearingWarrantyExpiry = async () => {
    return await assetRepository.getAssetsNearingWarrantyExpiry();
};

const logMaintenance = async (maintenanceData, createdBy) => {
    const asset = await assetRepository.getAssetById(maintenanceData.assetId);
    if (!asset) {
        throw new Error("Asset not found");
    }

    const record = await assetRepository.createMaintenance({ ...maintenanceData, createdBy });
    await assetRepository.updateAsset(maintenanceData.assetId, { status: "UnderMaintenance" });

    return record;
};

const completeMaintenance = async (assetId) => {
    const asset = await assetRepository.getAssetById(assetId);
    if (!asset) {
        throw new Error("Asset not found");
    }
    return await assetRepository.updateAsset(assetId, { status: "Active" });
};

const getMaintenanceRecords = async () => {
    return await assetRepository.getMaintenanceRecords();
};

const getMaintenanceById = async (id) => {
    const record = await assetRepository.getMaintenanceById(id);
    if (!record) {
        throw new Error("Maintenance record not found");
    }
    return record;
};

const getMaintenanceByAsset = async (assetId) => {
    return await assetRepository.getMaintenanceByAsset(assetId);
};

const getUpcomingMaintenance = async () => {
    return await assetRepository.getUpcomingMaintenance();
};

module.exports = {
    createAsset,
    getAssets,
    getAssetById,
    updateAsset,
    retireAsset,
    deleteAsset,
    getAssetsNearingWarrantyExpiry,
    logMaintenance,
    completeMaintenance,
    getMaintenanceRecords,
    getMaintenanceById,
    getMaintenanceByAsset,
    getUpcomingMaintenance,
};
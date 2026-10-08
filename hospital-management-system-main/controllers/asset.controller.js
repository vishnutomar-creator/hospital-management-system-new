const assetService = require("../services/asset.service");

const createAsset = async (req, res, next) => {
    try {
        const asset = await assetService.createAsset(req.body, req.user.id);
        res.status(201).json({ success: true, message: "Asset created successfully", data: asset });
    } catch (error) {
        next(error);
    }
};

const getAssets = async (req, res, next) => {
    try {
        const assets = await assetService.getAssets();
        res.status(200).json({ success: true, message: "Assets fetched successfully", data: assets });
    } catch (error) {
        next(error);
    }
};

const getAssetById = async (req, res, next) => {
    try {
        const asset = await assetService.getAssetById(req.params.id);
        res.status(200).json({ success: true, message: "Asset fetched successfully", data: asset });
    } catch (error) {
        next(error);
    }
};

const updateAsset = async (req, res, next) => {
    try {
        const asset = await assetService.updateAsset(req.params.id, req.body);
        res.status(200).json({ success: true, message: "Asset updated successfully", data: asset });
    } catch (error) {
        next(error);
    }
};

const retireAsset = async (req, res, next) => {
    try {
        const asset = await assetService.retireAsset(req.params.id);
        res.status(200).json({ success: true, message: "Asset retired successfully", data: asset });
    } catch (error) {
        next(error);
    }
};

const deleteAsset = async (req, res, next) => {
    try {
        const result = await assetService.deleteAsset(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        next(error);
    }
};

const getAssetsNearingWarrantyExpiry = async (req, res, next) => {
    try {
        const assets = await assetService.getAssetsNearingWarrantyExpiry();
        res.status(200).json({ success: true, message: "Assets nearing warranty expiry fetched successfully", data: assets });
    } catch (error) {
        next(error);
    }
};

const logMaintenance = async (req, res, next) => {
    try {
        const record = await assetService.logMaintenance(req.body, req.user.id);
        res.status(201).json({ success: true, message: "Maintenance logged successfully", data: record });
    } catch (error) {
        next(error);
    }
};

const completeMaintenance = async (req, res, next) => {
    try {
        const asset = await assetService.completeMaintenance(req.params.assetId);
        res.status(200).json({ success: true, message: "Maintenance marked complete, asset active again", data: asset });
    } catch (error) {
        next(error);
    }
};

const getMaintenanceRecords = async (req, res, next) => {
    try {
        const records = await assetService.getMaintenanceRecords();
        res.status(200).json({ success: true, message: "Maintenance records fetched successfully", data: records });
    } catch (error) {
        next(error);
    }
};

const getMaintenanceById = async (req, res, next) => {
    try {
        const record = await assetService.getMaintenanceById(req.params.id);
        res.status(200).json({ success: true, message: "Maintenance record fetched successfully", data: record });
    } catch (error) {
        next(error);
    }
};

const getMaintenanceByAsset = async (req, res, next) => {
    try {
        const records = await assetService.getMaintenanceByAsset(req.params.assetId);
        res.status(200).json({ success: true, message: "Maintenance history fetched successfully", data: records });
    } catch (error) {
        next(error);
    }
};

const getUpcomingMaintenance = async (req, res, next) => {
    try {
        const records = await assetService.getUpcomingMaintenance();
        res.status(200).json({ success: true, message: "Upcoming maintenance fetched successfully", data: records });
    } catch (error) {
        next(error);
    }
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
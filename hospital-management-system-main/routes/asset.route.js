const express = require("express");

const {
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
} = require("../controllers/asset.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const {
    createAssetValidator,
    logMaintenanceValidator,
    idValidator,
    assetIdParamValidator,
} = require("../validators/asset.validator");

const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.use(authMiddleware, authorizeRoles(ROLES.ADMIN));

router.post("/", createAssetValidator, validationMiddleware, createAsset);
router.post("/createasset", createAssetValidator, validationMiddleware, createAsset);
router.get("/", getAssets);
router.get("/getassets", getAssets);
router.get("/warranty-expiring", getAssetsNearingWarrantyExpiry);
router.get("/:id", idValidator, validationMiddleware, getAssetById);
router.get("/getassetby/:id", idValidator, validationMiddleware, getAssetById);
router.put("/:id", idValidator, validationMiddleware, updateAsset);
router.put("/updateassetby/:id", idValidator, validationMiddleware, updateAsset);
router.patch("/retireasset/:id", idValidator, validationMiddleware, retireAsset);
router.delete("/:id", idValidator, validationMiddleware, deleteAsset);
router.delete("/deleteassetby/:id", idValidator, validationMiddleware, deleteAsset);

router.post("/maintenance/log", logMaintenanceValidator, validationMiddleware, logMaintenance);
router.get("/maintenance", getMaintenanceRecords);
router.get("/maintenance/upcoming", getUpcomingMaintenance);
router.get("/maintenance/:id", idValidator, validationMiddleware, getMaintenanceById);
router.get("/maintenance/by-asset/:assetId", assetIdParamValidator, getMaintenanceByAsset);
router.patch("/maintenance/complete/:assetId", assetIdParamValidator, completeMaintenance);

module.exports = router;
const express = require("express");

const {
    createPO,
    getPOs,
    getPOById,
    getPOsBySupplier,
    approvePO,
    markOrdered,
    receivePO,
    cancelPO,
    deletePO,
} = require("../controllers/purchaseorder.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const {
    createPOValidator,
    idValidator,
    supplierIdParamValidator,
} = require("../validators/purchaseorder.validator");

const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.use(authMiddleware, authorizeRoles(ROLES.ADMIN));

router.post("/", createPOValidator, validationMiddleware, createPO);
router.post("/createpo", createPOValidator, validationMiddleware, createPO);
router.get("/", getPOs);
router.get("/getpos", getPOs);
router.get("/:id", idValidator, validationMiddleware, getPOById);
router.get("/getposby/:id", idValidator, validationMiddleware, getPOById);
router.get("/getposbysupplier/:supplierId", supplierIdParamValidator, getPOsBySupplier);
router.patch("/approvepo/:id", idValidator, validationMiddleware, approvePO);
router.patch("/:id/approve", idValidator, validationMiddleware, approvePO);
router.patch("/markordered/:id", idValidator, validationMiddleware, markOrdered);
router.patch("/:id/order", idValidator, validationMiddleware, markOrdered);
router.patch("/receivepo/:id", idValidator, validationMiddleware, receivePO);
router.patch("/:id/receive", idValidator, validationMiddleware, receivePO);
router.patch("/cancelpo/:id", idValidator, validationMiddleware, cancelPO);
router.patch("/:id/cancel", idValidator, validationMiddleware, cancelPO);
router.delete("/:id", idValidator, validationMiddleware, deletePO);
router.delete("/deletepoby/:id", idValidator, validationMiddleware, deletePO);

module.exports = router;
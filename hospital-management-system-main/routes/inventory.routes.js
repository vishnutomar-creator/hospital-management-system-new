const express = require("express");

const {
    createItem,
    getItems,
    getItemById,
    updateItem,
    restockItem,
    consumeItem,
    getLowStockItems,
    getExpiringItems,
    deleteItem,
} = require("../controllers/inventory.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const {
    createItemValidator,
    stockChangeValidator,
    idValidator,
} = require("../validators/inventory.validator");

const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.get("/", authMiddleware, getItems);
router.get("/getitems", authMiddleware, getItems);
router.get("/low-stock", authMiddleware, getLowStockItems);
router.get("/expiring", authMiddleware, getExpiringItems);
router.get("/getitemby/:id", authMiddleware, idValidator, validationMiddleware, getItemById);

router.post("/", authMiddleware, authorizeRoles(ROLES.ADMIN), createItemValidator, validationMiddleware, createItem);
router.post("/createitem", authMiddleware, authorizeRoles(ROLES.ADMIN), createItemValidator, validationMiddleware, createItem);
router.put("/updateitemby/:id", idValidator, validationMiddleware, updateItem);
router.patch("/restock/:id", stockChangeValidator, validationMiddleware, restockItem);
router.patch("/consume/:id", stockChangeValidator, validationMiddleware, consumeItem);
router.delete("/deleteitemby/:id", idValidator, validationMiddleware, deleteItem);

module.exports = router;
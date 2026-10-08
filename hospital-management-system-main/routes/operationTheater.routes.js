const express = require("express");

const {
    createOT,
    getOTs,
    getOTById,
    updateOT,
    setUnderMaintenance,
    setAvailable,
    deleteOT,
    getAvailableOTsForDate,
} = require("../controllers/operationTheater.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const {
    createOTValidator,
    idValidator,
    availabilityValidator,
} = require("../validators/operationTheater.validator");

const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.use(authMiddleware, authorizeRoles(ROLES.ADMIN, ROLES.DOCTOR));

router.post("/", createOTValidator, validationMiddleware, createOT);
router.post("/createot", createOTValidator, validationMiddleware, createOT);
router.get("/", getOTs);
router.get("/getots", getOTs);
router.get("/availability", availabilityValidator, validationMiddleware, getAvailableOTsForDate);
router.get("/:id", idValidator, validationMiddleware, getOTById);
router.get("/getotby/:id", idValidator, validationMiddleware, getOTById);
router.put("/:id", idValidator, validationMiddleware, updateOT);
router.put("/updateotby/:id", idValidator, validationMiddleware, updateOT);
router.patch("/setmaintenance/:id", idValidator, validationMiddleware, setUnderMaintenance);
router.patch("/setavailable/:id", idValidator, validationMiddleware, setAvailable);
router.delete("/:id", idValidator, validationMiddleware, deleteOT);
router.delete("/deleteotby/:id", idValidator, validationMiddleware, deleteOT);

module.exports = router;
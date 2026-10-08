const express = require("express");

const {
    createSurgery,
    getSurgeries,
    getSurgeryById,
    updateSurgery,
    deleteSurgery,
} = require("../controllers/surgery.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const {
    createSurgeryValidator,
    updateSurgeryValidator,
    surgeryIdValidator,
} = require("../validators/surgery.validator");

const router = express.Router();

router.post("/", createSurgeryValidator, validationMiddleware, createSurgery);
router.post("/createsurgery", createSurgeryValidator, validationMiddleware, createSurgery);
router.get("/", getSurgeries);
router.get("/getsurgeries", getSurgeries);
router.get("/:id", surgeryIdValidator, validationMiddleware, getSurgeryById);
router.get("/getsurgeryby/:id", surgeryIdValidator, validationMiddleware, getSurgeryById);
router.put("/:id", updateSurgeryValidator, validationMiddleware, updateSurgery);
router.put("/updatesurgeryby/:id", updateSurgeryValidator, validationMiddleware, updateSurgery);
router.delete("/:id", surgeryIdValidator, validationMiddleware, deleteSurgery);
router.delete("/deletesurgeryby/:id", surgeryIdValidator, validationMiddleware, deleteSurgery);

module.exports = router;
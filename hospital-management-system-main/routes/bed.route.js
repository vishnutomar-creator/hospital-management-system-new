const express = require("express");

const {
    createBed,
    getBeds,
    getBedById,
    updateBed,
    allocateBed,
    releaseBed,
    deleteBed,
} = require("../controllers/bed.controller");

const { validationMiddleware } = require("../middlewares/validation.middleware");
const {
    createBedValidator,
    allocateBedValidator,
    bedIdValidator,
} = require("../validators/bed.validator");

const router = express.Router();

router.post("/createbed", createBedValidator, validationMiddleware, createBed);
router.get("/getbeds", getBeds);
router.get("/getbedby/:id", bedIdValidator, validationMiddleware, getBedById);
router.put("/updatebedby/:id", bedIdValidator, validationMiddleware, updateBed);
router.patch("/allocatebed/:id", allocateBedValidator, validationMiddleware, allocateBed);
router.patch("/releasebed/:id", bedIdValidator, validationMiddleware, releaseBed);
router.delete("/deletebedby/:id", bedIdValidator, validationMiddleware, deleteBed);

module.exports = router;
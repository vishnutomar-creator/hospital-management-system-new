const express = require("express");
const {
    createWard,
    getWards,
    getWardById,
    updateWard,
    deleteWard,
} = require("../controllers/ward.controller");

const router = express.Router();

router.post("/createward", createWard);
router.get("/getwards", getWards);
router.get("/", getWards);
router.get("/getwardby/:id", getWardById);
router.get("/:id", getWardById);
router.put("/updatewardby/:id", updateWard);
router.put("/:id", updateWard);
router.delete("/deletewardby/:id", deleteWard);
router.delete("/:id", deleteWard);

module.exports = router;

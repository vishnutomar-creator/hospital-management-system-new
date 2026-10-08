const express = require("express");

const {
  createNurse,
  getNurses,
  getNurseById,
  updateNurse,
  deleteNurse,
  getNursesByWard,
} = require("../controllers/nurses.controller");

const router = express.Router();

router.post("/createnurse", createNurse);
router.post("/", createNurse);
router.get("/getnurses", getNurses);
router.get("/", getNurses);
router.get("/getnurseby/:id", getNurseById);
router.get("/:id", getNurseById);
router.get("/getnursesbyward/:wardId", getNursesByWard);
router.put("/updatenurseby/:id", updateNurse);
router.put("/:id", updateNurse);
router.delete("/deletenurseby/:id", deleteNurse);
router.delete("/:id", deleteNurse);

module.exports = router;
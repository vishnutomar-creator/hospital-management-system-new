const express = require("express");

const {
  getDashboard,
} = require("../controllers/dashboard.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// GET Dashboard
router.get(
  "/dashboard",
  authMiddleware,
  getDashboard
);

module.exports = router;
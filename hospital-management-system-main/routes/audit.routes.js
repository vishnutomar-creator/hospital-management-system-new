const express = require("express");

const {
  createAuditLog,
  getAuditLogs,
  getAuditLogById,
  getAuditLogsByUser,
  getAuditLogsByModule,
} = require("../controllers/audit.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Create audit log
router.post(
  "/audit",
  authMiddleware,
  createAuditLog
);

// Get all audit logs
router.get(
  "/audit",
  authMiddleware,
  getAuditLogs
);

// Get audit by ID
router.get(
  "/audit/:id",
  authMiddleware,
  getAuditLogById
);

// Get audit by user
router.get(
  "/audit/user/:userId",
  authMiddleware,
  getAuditLogsByUser
);

// Get audit by module
router.get(
  "/audit/module/:module",
  authMiddleware,
  getAuditLogsByModule
);

module.exports = router;
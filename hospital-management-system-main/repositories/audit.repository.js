const AuditLog = require("../models/AuditLog");

// Create Audit
const createAuditLog = async (auditData) => {
  return await AuditLog.create(auditData);
};

// Get All Audit Logs
const getAuditLogs = async () => {
  return await AuditLog.find()
    .populate("userId", "name email role")
    .sort({
      createdAt: -1,
    });
};

// Get Audit By ID
const getAuditLogById = async (id) => {
  return await AuditLog.findById(id)
    .populate("userId", "name email role");
};

// Get Audit Logs By User
const getAuditLogsByUser = async (userId) => {
  return await AuditLog.find({
    userId,
  })
    .populate("userId", "name email role")
    .sort({
      createdAt: -1,
    });
};

// Get Audit Logs By Module
const getAuditLogsByModule = async (module) => {
  return await AuditLog.find({
    module,
  })
    .populate("userId", "name email role")
    .sort({
      createdAt: -1,
    });
};

module.exports = {
  createAuditLog,
  getAuditLogs,
  getAuditLogById,
  getAuditLogsByUser,
  getAuditLogsByModule,
};
const auditService = require("../services/audit.service");

const createAuditLog = async (req, res, next) => {
  try {
    const auditLog = await auditService.createAuditLog({
      ...req.body,
      userId: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Audit log created successfully",
      data: auditLog,
    });
  } catch (error) {
    next(error);
  }
};

const getAuditLogs = async (req, res, next) => {
  try {
    const auditLogs = await auditService.getAuditLogs();

    return res.status(200).json({
      success: true,
      message: "Audit logs fetched successfully",
      data: auditLogs,
    });
  } catch (error) {
    next(error);
  }
};

const getAuditLogById = async (req, res, next) => {
  try {
    const auditLog =
      await auditService.getAuditLogById(req.params.id);

    return res.status(200).json({
      success: true,
      data: auditLog,
    });
  } catch (error) {
    next(error);
  }
};

const getAuditLogsByUser = async (req, res, next) => {
  try {
    const auditLogs =
      await auditService.getAuditLogsByUser(
        req.params.userId
      );

    return res.status(200).json({
      success: true,
      data: auditLogs,
    });
  } catch (error) {
    next(error);
  }
};

const getAuditLogsByModule = async (req, res, next) => {
  try {
    const auditLogs =
      await auditService.getAuditLogsByModule(
        req.params.module
      );

    return res.status(200).json({
      success: true,
      data: auditLogs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAuditLog,
  getAuditLogs,
  getAuditLogById,
  getAuditLogsByUser,
  getAuditLogsByModule,
};
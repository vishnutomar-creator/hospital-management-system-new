const auditRepository = require("../repositories/audit.repository");

const createAuditLog = async ({
  userId,
  action,
  module,
  recordId,
  method,
  endpoint,
  ipAddress,
  details,
}) => {
  return await auditRepository.createAuditLog({
    userId,
    action,
    module,
    recordId,
    method,
    endpoint,
    ipAddress,
    details,
  });
};

const getAuditLogs = async () => {
  return await auditRepository.getAuditLogs();
};

const getAuditLogById = async (id) => {
  const audit =
    await auditRepository.getAuditLogById(id);

  if (!audit) {
    const error = new Error(
      "Audit log not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return audit;
};

const getAuditLogsByUser = async (userId) => {
  return await auditRepository.getAuditLogsByUser(
    userId
  );
};

const getAuditLogsByModule = async (module) => {
  return await auditRepository.getAuditLogsByModule(
    module
  );
};

module.exports = {
  createAuditLog,
  getAuditLogs,
  getAuditLogById,
  getAuditLogsByUser,
  getAuditLogsByModule,
};
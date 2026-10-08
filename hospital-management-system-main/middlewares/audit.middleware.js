const auditRepository = require("../repositories/audit.repository");

const auditLogger = (moduleName) => {
  return async (req, res, next) => {
    const originalJson = res.json;

    res.json = function (data) {
      if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && res.statusCode < 400) {
        try {
          const recordId = data?.data?._id || data?.data?.id || req.params?.id || null;
          auditRepository.createAuditLog({
            userId: req.user ? req.user._id || req.user.userId : null,
            action: `${req.method}_${moduleName.toUpperCase()}`,
            module: moduleName,
            recordId: recordId,
            method: req.method,
            endpoint: req.originalUrl,
            ipAddress: req.ip || req.connection.remoteAddress,
            details: {
              body: req.body,
              params: req.params,
            },
          }).catch((err) => console.error("Error creating audit log:", err));
        } catch (err) {
          console.error("Audit log middleware error:", err);
        }
      }
      return originalJson.apply(this, arguments);
    };

    next();
  };
};

module.exports = auditLogger;

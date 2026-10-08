const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    action: {
      type: String,
      required: true,
    },

    module: {
      type: String,
      required: true,
    },

    recordId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    method: {
      type: String,
    },

    endpoint: {
      type: String,
    },

    ipAddress: {
      type: String,
    },

    details: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AuditLog",
  auditSchema
);
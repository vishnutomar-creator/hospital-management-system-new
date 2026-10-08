const NOTIFICATION_TYPES = {
  APPOINTMENT: "appointment",
  PAYMENT: "payment",
  PRESCRIPTION: "prescription",
  MEDICAL_RECORD: "medical_record",
  SYSTEM: "system",
};

const NOTIFICATION_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

const NOTIFICATION_STATUS = {
  UNREAD: "unread",
  READ: "read",
};

module.exports = {
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITY,
  NOTIFICATION_STATUS,
};
const createNotificationDTO = (data) => {
  return {
    userId: data.userId,
    title: data.title,
    message: data.message,
    type: data.type || "system",
    priority: data.priority || "medium",
    referenceId: data.referenceId || null,
    referenceType: data.referenceType || null,
  };
};

const updateNotificationDTO = (data) => {
  const dto = {};

  if (data.status !== undefined) {
    dto.status = data.status;
  }

  if (data.priority !== undefined) {
    dto.priority = data.priority;
  }

  if (data.readAt !== undefined) {
    dto.readAt = data.readAt;
  }

  return dto;
};

module.exports = {
  createNotificationDTO,
  updateNotificationDTO,
};
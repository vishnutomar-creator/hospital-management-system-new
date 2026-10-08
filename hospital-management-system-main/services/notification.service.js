const notificationRepository = require(
  "../repositories/notification.repository"
);

const createNotification = async (
  notificationData
) => {
  return await notificationRepository.createNotification(
    notificationData
  );
};

const getNotifications = async () => {
  return await notificationRepository.getNotifications();
};

const getNotificationById = async (id) => {
  const notification =
    await notificationRepository.getNotificationById(
      id
    );

  if (!notification) {
    const error = new Error(
      "Notification not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return notification;
};

const getNotificationsByUser = async (
  userId
) => {
  return await notificationRepository.getNotificationsByUser(
    userId
  );
};

const updateNotification = async (
  id,
  notificationData
) => {
  const notification =
    await notificationRepository.updateNotification(
      id,
      notificationData
    );

  if (!notification) {
    const error = new Error(
      "Notification not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return notification;
};

const deleteNotification = async (id) => {
  const notification =
    await notificationRepository.deleteNotification(
      id
    );

  if (!notification) {
    const error = new Error(
      "Notification not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return notification;
};

const markAllAsRead = async (userId) => {
  return await notificationRepository.markAllAsRead(
    userId
  );
};

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  getNotificationsByUser,
  updateNotification,
  deleteNotification,
  markAllAsRead,
};
const notificationService = require("../services/notification.service");

const sendBatchNotifications = async (notificationsList) => {
  try {
    if (!Array.isArray(notificationsList) || notificationsList.length === 0) {
      return { created: 0 };
    }

    let count = 0;
    for (const notif of notificationsList) {
      if (notif.userId && notif.title && notif.message) {
        await notificationService.createNotification(notif);
        count++;
      }
    }

    return { created: count };
  } catch (error) {
    console.error("Error processing notification job:", error);
    throw error;
  }
};

module.exports = {
  sendBatchNotifications,
};

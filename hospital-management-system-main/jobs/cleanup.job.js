const notificationRepository = require("../repositories/notification.repository");

const runCleanup = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const notifications = await notificationRepository.getNotifications();
    const oldReadNotifications = notifications.filter(
      (n) => n.status === "read" && new Date(n.updatedAt) < thirtyDaysAgo
    );

    for (const notif of oldReadNotifications) {
      await notificationRepository.deleteNotification(notif._id);
    }

    return { cleaned: oldReadNotifications.length };
  } catch (error) {
    console.error("Error running cleanup job:", error);
    throw error;
  }
};

module.exports = {
  runCleanup,
};

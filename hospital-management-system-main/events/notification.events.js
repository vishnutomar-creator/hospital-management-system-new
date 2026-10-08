const eventEmitter = require("./eventEmitter");
const notificationService = require("../services/notification.service");

eventEmitter.on("notificationCreated", async (notificationData) => {
  try {
    await notificationService.createNotification(notificationData);
  } catch (error) {
    console.error("Error in notificationCreated event listener:", error);
  }
});

module.exports = eventEmitter;

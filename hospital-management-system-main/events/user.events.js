const eventEmitter = require("./eventEmitter");
const emailService = require("../services/email.service");
const notificationService = require("../services/notification.service");

eventEmitter.on("userCreated", async (user) => {
  try {
    // Send welcome email
    await emailService.sendEmail(
      user.email,
      "Welcome to HMS",
      `Hello ${user.name}, welcome to our Hospital Management System!`,
      `<b>Hello ${user.name}</b>,<br/>Welcome to our Hospital Management System!`
    );

    // Create notification
    await notificationService.createNotification({
      userId: user._id,
      title: "Welcome",
      message: "Welcome to our Hospital Management System!",
      type: "system",
    });
  } catch (error) {
    console.error("Error in userCreated event:", error);
  }
});

module.exports = eventEmitter;

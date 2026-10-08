const notificationService = require(
  "../services/notification.service"
);

const {
  createNotificationDTO,
  updateNotificationDTO,
} = require("../dto/notification.dto");

// CREATE
const createNotification = async (
  req,
  res,
  next
) => {
  try {
    const notificationData =
      createNotificationDTO(req.body);

    const notification =
      await notificationService.createNotification(
        notificationData
      );

    return res.status(201).json({
      success: true,
      message:
        "Notification created successfully",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL
const getNotifications = async (
  req,
  res,
  next
) => {
  try {
    const notifications =
      await notificationService.getNotifications();

    return res.status(200).json({
      success: true,
      message:
        "Notifications fetched successfully",
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

// GET BY ID
const getNotificationById = async (
  req,
  res,
  next
) => {
  try {
    const notification =
      await notificationService.getNotificationById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Notification fetched successfully",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

// GET USER NOTIFICATIONS
const getMyNotifications = async (
  req,
  res,
  next
) => {
  try {
    const notifications =
      await notificationService.getNotificationsByUser(
        req.user.userId
      );

    return res.status(200).json({
      success: true,
      message:
        "User notifications fetched successfully",
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
const updateNotification = async (
  req,
  res,
  next
) => {
  try {
    const notificationData =
      updateNotificationDTO(req.body);

    const notification =
      await notificationService.updateNotification(
        req.params.id,
        notificationData
      );

    return res.status(200).json({
      success: true,
      message:
        "Notification updated successfully",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
const deleteNotification = async (
  req,
  res,
  next
) => {
  try {
    await notificationService.deleteNotification(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Notification deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// MARK ALL READ
const markAllAsRead = async (
  req,
  res,
  next
) => {
  try {
    await notificationService.markAllAsRead(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      message:
        "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  getMyNotifications,
  updateNotification,
  deleteNotification,
  markAllAsRead,
};
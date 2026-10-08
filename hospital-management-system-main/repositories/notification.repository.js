const Notification = require("../models/Notification");

// Create
const createNotification = async (
  notificationData
) => {
  return await Notification.create(
    notificationData
  );
};

// Get all
const getNotifications = async () => {
  return await Notification.find()
    .populate(
      "userId",
      "name email role"
    )
    .sort({
      createdAt: -1,
    });
};

// Get by ID
const getNotificationById = async (id) => {
  return await Notification.findById(id)
    .populate(
      "userId",
      "name email role"
    );
};

// Get user's notifications
const getNotificationsByUser = async (
  userId
) => {
  return await Notification.find({
    userId,
  }).sort({
    createdAt: -1,
  });
};

// Update
const updateNotification = async (
  id,
  notificationData
) => {
  return await Notification.findByIdAndUpdate(
    id,
    notificationData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Delete
const deleteNotification = async (id) => {
  return await Notification.findByIdAndDelete(
    id
  );
};

// Mark all as read
const markAllAsRead = async (userId) => {
  return await Notification.updateMany(
    {
      userId,
      status: "unread",
    },
    {
      $set: {
        status: "read",
        readAt: new Date(),
      },
    }
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
const express = require("express");

const {
  createNotification,
  getNotifications,
  getNotificationById,
  getMyNotifications,
  updateNotification,
  deleteNotification,
  markAllAsRead,
} = require(
  "../controllers/notification.controller"
);

const {
  validateCreateNotification,
  validateUpdateNotification,
} = require(
  "../validators/notification.validator"
);

const authMiddleware = require(
  "../middlewares/auth.middleware"
);

const router = express.Router();

// Create
router.post(
  "/notifications",
  authMiddleware,
  validateCreateNotification,
  createNotification
);

// Get all
router.get(
  "/notifications",
  authMiddleware,
  getNotifications
);

// Get my notifications
router.get(
  "/notifications/my",
  authMiddleware,
  getMyNotifications
);

// Get by ID
router.get(
  "/notifications/:id",
  authMiddleware,
  getNotificationById
);

// Update
router.put(
  "/notifications/:id",
  authMiddleware,
  validateUpdateNotification,
  updateNotification
);

// Delete
router.delete(
  "/notifications/:id",
  authMiddleware,
  deleteNotification
);

// Mark all read
router.patch(
  "/notifications/read-all",
  authMiddleware,
  markAllAsRead
);

module.exports = router;
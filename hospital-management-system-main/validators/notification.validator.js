const mongoose = require("mongoose");

const validateCreateNotification = (
  req,
  res,
  next
) => {
  const {
    userId,
    title,
    message,
  } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid userId",
    });
  }

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "title is required",
    });
  }

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "message is required",
    });
  }

  next();
};

const validateUpdateNotification = (
  req,
  res,
  next
) => {
  const {
    status,
    priority,
  } = req.body;

  if (
    status &&
    !["unread", "read"].includes(status)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid notification status",
    });
  }

  if (
    priority &&
    !["low", "medium", "high"].includes(
      priority
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid notification priority",
    });
  }

  next();
};

module.exports = {
  validateCreateNotification,
  validateUpdateNotification,
};
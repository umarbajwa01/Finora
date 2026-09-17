const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Notification = require("../models/Notification");

// GET /api/notifications
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.userId })
    .sort({ createdAt: -1 })
    .limit(50);
  const unreadCount = await Notification.countDocuments({ userId: req.userId, read: false });
  res.json(new ApiResponse(200, { notifications, unreadCount }));
});

// PATCH /api/notifications/:id/read
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { read: true },
    { new: true }
  );
  if (!notification) throw new ApiError(404, "Notification not found.");
  res.json(new ApiResponse(200, notification));
});

// PATCH /api/notifications/read-all
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.userId, read: false }, { read: true });
  res.json(new ApiResponse(200, null, "All notifications marked as read."));
});

module.exports = { getNotifications, markAsRead, markAllAsRead };

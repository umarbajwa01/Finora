const express = require("express");
const { requireAuth } = require("../middleware/auth");
const notificationController = require("../controllers/notification.controller");

const router = express.Router();

router.use(requireAuth);

router.get("/", notificationController.getNotifications);
router.patch("/read-all", notificationController.markAllAsRead);
router.patch("/:id/read", notificationController.markAsRead);

module.exports = router;

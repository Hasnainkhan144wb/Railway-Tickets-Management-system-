const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
  toggleReadStatus,
  deleteNotification,
  clearAllNotifications,
} = require("../controllers/notificationController");

router.get("/", protect, getNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.put("/mark-read", protect, markAllAsRead);
router.put("/:id/mark-read", protect, markAsRead);
router.put("/:id/toggle", protect, toggleReadStatus);
router.delete("/:id", protect, deleteNotification);
router.delete("/", protect, clearAllNotifications);

module.exports = router;

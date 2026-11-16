const express = require("express");

const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();


// GET MY NOTIFICATIONS
router.get(
  "/",
  authenticateToken,
  getMyNotifications
);


// MARK ONE AS READ
router.patch(
  "/:id/read",
  authenticateToken,
  markAsRead
);


// MARK ALL AS READ
router.patch(
  "/read-all",
  authenticateToken,
  markAllAsRead
);


module.exports = router;
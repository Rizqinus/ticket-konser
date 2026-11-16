const db = require("../config/db");

// ========================================
// GET MY NOTIFICATIONS
// ========================================
const getMyNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [notifications] = await db.query(
      `SELECT
        id,
        title,
        message,
        is_read,
        created_at
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC`,
      [user_id]
    );

    res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      data: notifications,
    });

  } catch (error) {
    console.error("Get Notifications Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ========================================
// MARK NOTIFICATION AS READ
// ========================================
const markAsRead = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const [result] = await db.query(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE id = ?
       AND user_id = ?`,
      [id, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });

  } catch (error) {
    console.error("Mark Notification Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ========================================
// MARK ALL AS READ
// ========================================
const markAllAsRead = async (req, res) => {
  try {
    const user_id = req.user.id;

    await db.query(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE user_id = ?`,
      [user_id]
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });

  } catch (error) {
    console.error("Mark All Notifications Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
};
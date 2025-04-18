const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/", async (req, res) => {
  const { email } = req.query;
  try {
    const [announcements] = await db.query(
      `SELECT id,title,message,url,created_at
         FROM announcements
         ORDER BY created_at DESC`
    );

    const [notifications] = await db.query(
      `SELECT id,title,message,status,url,created_at
         FROM notification
         WHERE email = ?
         ORDER BY created_at DESC`,
      [email]
    );

    return res.json({ announcements, notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return res.status(500).json({ message: "Failed to fetch notifications!" });
  }
});

router.patch("/:id/read", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Notification ID is required" });
  }

  try {
    const [result] = await db.query(
      `UPDATE notification
            SET status = 'read'
          WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification marked as read", success: true });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ message: "Failed to update notification" });
  }
});

module.exports = router;

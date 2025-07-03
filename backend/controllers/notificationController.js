// controllers/notificationController.js
const pool = require('../db/pool');

// GET all notifications for a specific user
exports.getUserNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// CREATE a notification for a fine
exports.createFineNotification = async (user_id, amount, group_name) => {
  const message = `Hey, you have received a fine of Ksh ${amount} from ${group_name}`;

  try {
    await pool.query(
      `INSERT INTO notifications (user_id, message, status, created_at)
       VALUES ($1, $2, 'Unread', NOW())`,
      [user_id, message]
    );
  } catch (err) {
    console.error('Error creating fine notification:', err);
    throw err;
  }
};

// MARK notification as read (optional)
exports.markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    await pool.query(
      `UPDATE notifications SET status = 'Read' WHERE notification_id = $1`,
      [notificationId]
    );
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

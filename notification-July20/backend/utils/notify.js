const pool = require('../config/db');

/**
 * Insert a notification row for a given user.
 * type: 'task_assigned' | 'birthday' | 'salary_credited' | 'task_status' | 'meeting' | 'general'
 */
async function createNotification({ userId, type, title, message }) {
  const result = await pool.query(
    `INSERT INTO notifications (user_id, type, title, message)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, type, title, message]
  );
  return result.rows[0];
}

module.exports = { createNotification };

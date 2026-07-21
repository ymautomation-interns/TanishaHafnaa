const express = require('express');
const pool = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate, requireRole('employee'));

// GET /api/employee/me — basic info
router.get('/me', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, u.email FROM employees e
       JOIN users u ON u.id = e.user_id
       WHERE e.id = $1`,
      [req.user.employeeId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Employee profile not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/employee/me — self-edit basic info
// Employees can update dob, phone, address, and salary as requested.
// NOTE: in most real HR systems, salary changes should require admin
// approval rather than a direct self-edit — this is left fully editable
// here because that's what was asked for, but consider gating it behind
// an admin-approval flow before shipping to production.
router.put('/me', async (req, res) => {
  const { dob, phone, address, salary } = req.body;
  try {
    const result = await pool.query(
      `UPDATE employees
       SET dob = COALESCE($1, dob),
           phone = COALESCE($2, phone),
           address = COALESCE($3, address),
           salary = COALESCE($4, salary),
           updated_at = now()
       WHERE id = $5
       RETURNING *`,
      [dob || null, phone || null, address || null, salary ?? null, req.user.employeeId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

// GET /api/employee/meetings
router.get('/meetings', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM meetings WHERE employee_id = $1 ORDER BY meeting_time ASC`,
      [req.user.employeeId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching meetings' });
  }
});

// GET /api/employee/tasks
router.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tasks WHERE assigned_to = $1 ORDER BY created_at DESC`,
      [req.user.employeeId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching tasks' });
  }
});

// PATCH /api/employee/tasks/:id/status — employee updates task progress
router.patch('/tasks/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'in_progress', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    const taskResult = await pool.query(
      `UPDATE tasks SET status = $1 WHERE id = $2 AND assigned_to = $3 RETURNING *`,
      [status, req.params.id, req.user.employeeId]
    );
    if (!taskResult.rows[0]) return res.status(404).json({ error: 'Task not found' });
    res.json(taskResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating task' });
  }
});

// GET /api/employee/notifications
router.get('/notifications', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching notifications' });
  }
});

// PATCH /api/employee/notifications/:id/read
router.patch('/notifications/:id/read', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *`,
      [req.params.id, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/employee/notifications/read-all
router.patch('/notifications/read-all', async (req, res) => {
  try {
    await pool.query(`UPDATE notifications SET is_read = true WHERE user_id = $1`, [req.user.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

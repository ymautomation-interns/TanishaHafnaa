const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');
const { createNotification } = require('../utils/notify');

const router = express.Router();
router.use(authenticate, requireRole('admin'));

// GET /api/admin/employees — list all employees
router.get('/employees', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, u.email FROM employees e
       JOIN users u ON u.id = e.user_id
       ORDER BY e.full_name ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching employees' });
  }
});

// GET /api/admin/employees/:id
router.get('/employees/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, u.email FROM employees e JOIN users u ON u.id = e.user_id WHERE e.id = $1`,
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Employee not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/employees — create a new employee (login + profile)
router.post('/employees', async (req, res) => {
  const { email, password, fullName, department, designation, salary, dob, phone } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'email, password and fullName are required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const hash = await bcrypt.hash(password, 10);
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'employee') RETURNING id`,
      [email, hash]
    );
    const userId = userResult.rows[0].id;

    const codeResult = await client.query(`SELECT COUNT(*)::int AS c FROM employees`);
    const employeeCode = `EMP${String(codeResult.rows[0].c + 1).padStart(4, '0')}`;

    const empResult = await client.query(
      `INSERT INTO employees (user_id, employee_code, full_name, department, designation, salary, dob, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [userId, employeeCode, fullName, department || null, designation || null, salary || 0, dob || null, phone || null]
    );

    await client.query('COMMIT');
    res.status(201).json(empResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    res.status(500).json({ error: 'Server error creating employee' });
  } finally {
    client.release();
  }
});

// POST /api/admin/tasks — assign a task to an employee (notifies them)
router.post('/tasks', async (req, res) => {
  const { title, description, assignedTo, priority, dueDate } = req.body;
  if (!title || !assignedTo) {
    return res.status(400).json({ error: 'title and assignedTo are required' });
  }
  try {
    const taskResult = await pool.query(
      `INSERT INTO tasks (title, description, assigned_to, assigned_by, priority, due_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description || null, assignedTo, req.user.id, priority || 'medium', dueDate || null]
    );
    const task = taskResult.rows[0];

    const empUser = await pool.query(`SELECT user_id, full_name FROM employees WHERE id = $1`, [assignedTo]);
    if (empUser.rows[0]) {
      await createNotification({
        userId: empUser.rows[0].user_id,
        type: 'task_assigned',
        title: 'New task assigned',
        message: `You've been assigned a new task: "${title}"${dueDate ? ` — due ${dueDate}` : ''}.`,
      });
    }

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error assigning task' });
  }
});

// GET /api/admin/tasks — view all tasks
router.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, e.full_name AS employee_name FROM tasks t
       JOIN employees e ON e.id = t.assigned_to
       ORDER BY t.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching tasks' });
  }
});

// POST /api/admin/meetings — schedule a meeting for an employee
router.post('/meetings', async (req, res) => {
  const { employeeId, title, meetingTime, location, notes } = req.body;
  if (!employeeId || !title || !meetingTime) {
    return res.status(400).json({ error: 'employeeId, title and meetingTime are required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO meetings (employee_id, title, meeting_time, location, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [employeeId, title, meetingTime, location || null, notes || null, req.user.id]
    );

    const empUser = await pool.query(`SELECT user_id FROM employees WHERE id = $1`, [employeeId]);
    if (empUser.rows[0]) {
      await createNotification({
        userId: empUser.rows[0].user_id,
        type: 'meeting',
        title: 'New meeting scheduled',
        message: `"${title}" has been scheduled on ${new Date(meetingTime).toLocaleString()}.`,
      });
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error scheduling meeting' });
  }
});

// POST /api/admin/employees/:id/salary-credit — notify employee salary was credited
router.post('/employees/:id/salary-credit', async (req, res) => {
  const { amount, note } = req.body;
  try {
    const empResult = await pool.query(`SELECT user_id, full_name, salary FROM employees WHERE id = $1`, [req.params.id]);
    const employee = empResult.rows[0];
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    const creditedAmount = amount ?? employee.salary;
    await createNotification({
      userId: employee.user_id,
      type: 'salary_credited',
      title: 'Salary credited',
      message: `Your salary of ₹${creditedAmount} has been credited.${note ? ` Note: ${note}` : ''}`,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error sending salary notification' });
  }
});

module.exports = router;

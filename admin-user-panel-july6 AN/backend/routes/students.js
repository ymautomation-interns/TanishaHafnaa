const express = require('express');
const pool = require('../db');
const router = express.Router();

// Middleware to check admin role
const isAdmin = (req, res, next) => {
  const role = req.headers['x-user-role'];
  if (role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// GET all students (both admin and user can access)
router.get('/students', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET student count (must come before :id to be matched first)
router.get('/students/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM students');
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error('Error getting student count:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single student by ID
router.get('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching student:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// CREATE student (admin only)
router.post('/students', isAdmin, async (req, res) => {
  try {
    const { name, email, phone, department } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email required' });
    }

    const result = await pool.query(
      'INSERT INTO students (name, email, phone, department) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone || null, department || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating student:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// UPDATE student (admin only)
router.put('/students/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, department } = req.body;

    const result = await pool.query(
      'UPDATE students SET name = $1, email = $2, phone = $3, department = $4 WHERE id = $5 RETURNING *',
      [name, email, phone || null, department || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// DELETE student (admin only)
router.delete('/students/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ success: true, message: 'Student deleted' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

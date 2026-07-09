import express from 'express';
import cors from 'cors';
import { query } from './src/utils/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Salary Info endpoints
app.get('/api/salary-info', async (req, res) => {
  try {
    const result = await query('SELECT * FROM salary_info');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching salary info:', error);
    res.status(500).json({ error: 'Failed to fetch salary info' });
  }
});

app.get('/api/salary-info/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM salary_info WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Salary info not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching salary info:', error);
    res.status(500).json({ error: 'Failed to fetch salary info' });
  }
});

app.post('/api/salary-info', async (req, res) => {
  try {
    const { employee_id, basic_salary, allowances, deductions, net_salary } = req.body;
    const result = await query(
      'INSERT INTO salary_info (employee_id, basic_salary, allowances, deductions, net_salary) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [employee_id, basic_salary, allowances, deductions, net_salary]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating salary info:', error);
    res.status(500).json({ error: 'Failed to create salary info' });
  }
});

// Emergency Info endpoints
app.get('/api/emergency-info', async (req, res) => {
  try {
    const result = await query('SELECT * FROM emergency_info');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching emergency info:', error);
    res.status(500).json({ error: 'Failed to fetch emergency info' });
  }
});

app.get('/api/emergency-info/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM emergency_info WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Emergency info not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching emergency info:', error);
    res.status(500).json({ error: 'Failed to fetch emergency info' });
  }
});

app.post('/api/emergency-info', async (req, res) => {
  try {
    const { employee_id, contact_name, relationship, phone_number, address } = req.body;
    const result = await query(
      'INSERT INTO emergency_info (employee_id, contact_name, relationship, phone_number, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [employee_id, contact_name, relationship, phone_number, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating emergency info:', error);
    res.status(500).json({ error: 'Failed to create emergency info' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

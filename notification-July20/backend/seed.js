require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./config/db');

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // --- Admin account ---
    const adminPass = await bcrypt.hash('Admin@123', 10);
    const adminResult = await client.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ('admin@company.com', $1, 'admin')
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [adminPass]
    );
    console.log(adminResult.rows[0] ? 'Admin created: admin@company.com / Admin@123' : 'Admin already exists');

    // --- Sample employee account ---
    const empPass = await bcrypt.hash('Employee@123', 10);
    const empUserResult = await client.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ('jane.doe@company.com', $1, 'employee')
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [empPass]
    );

    if (empUserResult.rows[0]) {
      const userId = empUserResult.rows[0].id;
      await client.query(
        `INSERT INTO employees (user_id, employee_code, full_name, dob, phone, department, designation, salary)
         VALUES ($1, 'EMP0001', 'Jane Doe', '1996-07-20', '+91 90000 00000', 'Engineering', 'Software Engineer', 55000)`,
        [userId]
      );
      console.log('Sample employee created: jane.doe@company.com / Employee@123');
    } else {
      console.log('Sample employee already exists');
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();

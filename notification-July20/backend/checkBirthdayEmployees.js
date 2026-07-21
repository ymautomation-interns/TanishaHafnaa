require('dotenv').config();
const pool = require('./config/db');

async function checkBirthdayEmployees() {
  try {
    const result = await pool.query(
      `SELECT e.id, e.full_name, e.user_id, u.email 
       FROM employees e
       JOIN users u ON e.user_id = u.id
       WHERE e.dob IS NOT NULL
         AND EXTRACT(MONTH FROM e.dob) = EXTRACT(MONTH FROM CURRENT_DATE)
         AND EXTRACT(DAY FROM e.dob) = EXTRACT(DAY FROM CURRENT_DATE)`
    );

    console.log('Employees with birthday today:');
    result.rows.forEach(row => {
      console.log(` - ${row.full_name} (${row.email})`);
    });
    await pool.end();
  } catch (err) {
    console.error('Error:', err.message);
    await pool.end();
  }
}

checkBirthdayEmployees();

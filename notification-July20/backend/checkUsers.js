require('dotenv').config();
const pool = require('./config/db');

async function checkUsers() {
  try {
    const result = await pool.query('SELECT email, role FROM users');
    console.log('Users in database:');
    result.rows.forEach(row => console.log(` - ${row.email} (${row.role})`));
    await pool.end();
  } catch (err) {
    console.error('Error:', err.message);
    await pool.end();
  }
}

checkUsers();

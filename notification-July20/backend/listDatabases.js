require('dotenv').config();
const pool = require('./config/db');

async function listDatabases() {
  try {
    const result = await pool.query("SELECT datname FROM pg_database WHERE datistemplate = false");
    console.log('Available databases:');
    result.rows.forEach(row => console.log(' -', row.datname));
    await pool.end();
  } catch (err) {
    console.error('Error:', err.message);
    await pool.end();
  }
}

listDatabases();

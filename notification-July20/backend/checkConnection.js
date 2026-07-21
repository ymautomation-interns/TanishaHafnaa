require('dotenv').config();
const { Pool } = require('pg');

// First try connecting to postgres database to list databases
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function checkConnection() {
  try {
    console.log('Connecting to postgres database...');
    const result = await pool.query("SELECT datname FROM pg_database WHERE datistemplate = false");
    console.log('Available databases:');
    result.rows.forEach(row => console.log(' -', row.datname));
    await pool.end();
  } catch (err) {
    console.error('Error:', err.message);
    await pool.end();
  }
}

checkConnection();

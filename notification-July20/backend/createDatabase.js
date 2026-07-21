require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function createDatabase() {
  try {
    console.log('Creating empdb database...');
    await pool.query("CREATE DATABASE empdb");
    console.log('Database empdb created successfully');
    await pool.end();
  } catch (err) {
    if (err.message.includes('already exists')) {
      console.log('Database empdb already exists');
    } else {
      console.error('Error creating database:', err.message);
    }
    await pool.end();
  }
}

createDatabase();

require('dotenv').config();
const fs = require('fs');
const pool = require('./config/db');

async function loadSchema() {
  try {
    const schema = fs.readFileSync('./schema.sql', 'utf8');
    await pool.query(schema);
    console.log('Schema loaded successfully');
    await pool.end();
  } catch (err) {
    console.error('Error loading schema:', err);
    await pool.end();
    process.exit(1);
  }
}

loadSchema();

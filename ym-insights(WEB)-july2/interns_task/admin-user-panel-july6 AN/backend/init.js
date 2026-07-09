const pool = require('./db');
const argon2 = require('argon2');
require('dotenv').config();

async function initializeDatabase() {
  const client = await pool.connect();

  try {
    console.log('Creating tables...');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create students table
    await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        department VARCHAR(100),
        enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tables created successfully!');

    // Check if root user already exists
    const userCheck = await client.query('SELECT * FROM users WHERE username = $1', ['root']);

    if (userCheck.rows.length === 0) {
      // Hash the admin password
      const hashedPassword = await argon2.hash(process.env.ADMIN_PASSWORD || 'Admin@26');

      // Insert root user with admin role
      await client.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
        ['root', hashedPassword, 'admin']
      );

      console.log('Root admin user created successfully!');
      console.log('Username: root');
      console.log('Password: ' + (process.env.ADMIN_PASSWORD || 'Admin@26'));
      console.log('Role: admin');
    } else {
      console.log('Root user already exists!');
    }

    // Insert a sample regular user
    const regularUserCheck = await client.query('SELECT * FROM users WHERE username = $1', ['user1']);

    if (regularUserCheck.rows.length === 0) {
      const userPassword = await argon2.hash('user123');
      await client.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
        ['user1', userPassword, 'user']
      );
      console.log('Sample user1 created with password: user123');
    }

    console.log('Database initialization complete!');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

initializeDatabase();

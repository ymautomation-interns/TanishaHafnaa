const pool = require('./db');

async function viewLogins() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    console.log('Connected successfully!');
    
    try {
      const result = await client.query('SELECT id, username, role, created_at FROM users ORDER BY id');
      console.log('\n=== User Logins ===');
      console.log('ID | Username  | Role  | Created At');
      console.log('---|-----------|-------|-------------------------');
      
      if (result.rows.length === 0) {
        console.log('No users found in database.');
      } else {
        result.rows.forEach(row => {
          console.log(`${row.id} | ${row.username.padEnd(9)} | ${row.role.padEnd(5)} | ${row.created_at}`);
        });
        console.log(`\nTotal users: ${result.rows.length}`);
      }
    } catch (err) {
      console.error('Error querying database:', err);
    } finally {
      client.release();
      await pool.end();
    }
  } catch (err) {
    console.error('Error connecting to database:', err);
    console.error('Make sure PostgreSQL is running on localhost:5433');
    await pool.end();
  }
}

viewLogins();

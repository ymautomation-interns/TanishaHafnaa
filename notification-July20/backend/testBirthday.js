require('dotenv').config();
const pool = require('./config/db');
const { createNotification } = require('./utils/notify');

async function testBirthday() {
  try {
    const result = await pool.query(
      `SELECT e.id, e.full_name, e.user_id FROM employees e
       WHERE e.dob IS NOT NULL
         AND EXTRACT(MONTH FROM e.dob) = EXTRACT(MONTH FROM CURRENT_DATE)
         AND EXTRACT(DAY FROM e.dob) = EXTRACT(DAY FROM CURRENT_DATE)`
    );

    console.log(`Found ${result.rows.length} employee(s) with birthday today`);

    for (const emp of result.rows) {
      await createNotification({
        userId: emp.user_id,
        type: 'birthday',
        title: 'Happy Birthday! 🎉',
        message: `Happy Birthday, ${emp.full_name}! Wishing you a wonderful year ahead.`,
      });
      console.log(`Birthday notification sent to ${emp.full_name}`);
    }

    await pool.end();
  } catch (err) {
    console.error('Error:', err.message);
    await pool.end();
  }
}

testBirthday();

const cron = require('node-cron');
const pool = require('../config/db');
const { createNotification } = require('../utils/notify');

// Runs every day at 08:00 server time and notifies anyone whose
// dob's month/day matches today.
function startBirthdayCron() {
  cron.schedule('0 8 * * *', async () => {
    try {
      const result = await pool.query(
        `SELECT e.id, e.full_name, e.user_id FROM employees e
         WHERE e.dob IS NOT NULL
           AND EXTRACT(MONTH FROM e.dob) = EXTRACT(MONTH FROM CURRENT_DATE)
           AND EXTRACT(DAY FROM e.dob) = EXTRACT(DAY FROM CURRENT_DATE)`
      );

      for (const emp of result.rows) {
        await createNotification({
          userId: emp.user_id,
          type: 'birthday',
          title: 'Happy Birthday! 🎉',
          message: `Happy Birthday, ${emp.full_name}! Wishing you a wonderful year ahead.`,
        });
      }

      if (result.rows.length) {
        console.log(`Birthday cron: sent ${result.rows.length} notification(s).`);
      }
    } catch (err) {
      console.error('Birthday cron failed:', err);
    }
  });
}

module.exports = { startBirthdayCron };

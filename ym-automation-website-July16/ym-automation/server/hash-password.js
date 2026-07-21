// Usage: node hash-password.js "your-password"
// Prints a bcrypt hash to paste into ADMIN_PASSWORD_HASH in .env
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: node hash-password.js \"your-password\"");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log(hash);

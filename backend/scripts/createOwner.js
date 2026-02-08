const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
require("dotenv").config();

const run = async () => {
  const email = process.env.OWNER_EMAIL;
  const password = process.env.OWNER_PASSWORD;

  if (!email || !password) {
    console.error("Set OWNER_EMAIL and OWNER_PASSWORD in your .env file.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  await connection.execute(
    "INSERT INTO owners (email, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)",
    [email, passwordHash]
  );

  await connection.end();
  console.log("Owner account created/updated.");
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

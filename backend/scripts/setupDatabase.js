const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const run = async () => {
  try {
    // Connect without database
    const connectionConfig = {
      host: process.env.DB_HOST || "127.0.0.1",
      port: 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      authPlugins: {
        caching_sha2_password: () => () => {
          return "";
        },
      },
      waitForConnections: true,
    };
    
    const connection = await mysql.createConnection(connectionConfig);

    console.log("✓ Connected to MySQL");

    // Create database
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || "school_erp"}`);
    console.log("✓ Database created");

    // Switch to database
    await connection.query(`USE ${process.env.DB_NAME || "school_erp"}`);

    // Read schema file
    const schemaPath = path.join(__dirname, "../backend/sql/schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    // Execute schema statements
    const statements = schema.split(";").filter((s) => s.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }
    console.log("✓ Schema imported");

    // Create owner account
    const email = "owner@school.local";
    const password = "ChangeMe123!";
    const passwordHash = await bcrypt.hash(password, 12);

    await connection.query(
      "INSERT INTO owners (email, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)",
      [email, passwordHash]
    );
    console.log("✓ Owner account created:");
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);

    await connection.end();
    console.log("\n✅ Database setup complete!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

run();

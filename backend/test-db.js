const mysql = require("mysql2/promise");
require("dotenv").config();

const testConnection = async () => {
  let connection;
  try {
    console.log("Testing MySQL connection...");

    // Try named pipe for Windows XAMPP first
    try {
      console.log("\nAttempt 1: Named pipe connection...");
      const connection1 = await mysql.createConnection({
        socketPath: "\\\\.\\pipe\\MySQL",
        user: "root",
        password: "",
        database: process.env.DB_NAME || "school_erp",
      });
      	console.log("✓ Connected via named pipe!");
      connection = connection1;
    } catch (err1) {
      console.log("✗ Named pipe failed:", err1.message);
      
      // Fallback: Try TCP on 127.0.0.1
      console.log("\nAttempt 2: TCP connection to 127.0.0.1:3306...");
      connection = await mysql.createConnection({
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "",
        database: process.env.DB_NAME || "school_erp",
      });
      console.log("✓ Connected via TCP!");
    }

    const [owners] = await connection.query("SELECT * FROM owners");
    console.log("\nOwners in DB:", owners.length);
    owners.forEach((owner) => {
      console.log(`  - ${owner.email}`);
    });

    await connection.end();
  } catch (error) {
    console.error("✗ Error:", error.message);
  }
};

testConnection();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

// Import Owner model
const Owner = require("../src/models/Owner");

const run = async () => {
  const email = process.env.OWNER_EMAIL;
  const password = process.env.OWNER_PASSWORD;

  if (!email || !password) {
    console.error("Set OWNER_EMAIL and OWNER_PASSWORD in your .env file.");
    console.error("Example: OWNER_EMAIL=owner@school.com OWNER_PASSWORD=yourpassword");
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/school_erp";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    console.log("Password hashed successfully");

    // Find and update or create owner
    const owner = await Owner.findOneAndUpdate(
      { email },
      { email, passwordHash, tokenVersion: 0 },
      { upsert: true, new: true }
    );

    console.log("✓ Owner account created/updated successfully");
    console.log(`  Email: ${owner.email}`);
    console.log(`  ID: ${owner._id}`);
    
    await mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error creating owner:", error.message);
    process.exit(1);
  }
};

run();

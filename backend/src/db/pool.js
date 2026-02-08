require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Don't reconnect if already connected
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected.");
      return;
    }
    
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/school_erp";
    console.log("Connecting to MongoDB...");
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // Don't exit in serverless - throw error instead
    throw error;
  }
};

module.exports = { connectDB };

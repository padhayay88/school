require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Owner = require("./src/models/Owner");

const MONGO_URI = process.env.MONGO_URI;
const OWNER_EMAIL = process.env.OWNER_EMAIL;
const OWNER_PASSWORD = process.env.OWNER_PASSWORD;

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Clear existing owner
    await Owner.deleteMany({});
    console.log("Cleared existing owners.");

    if (!OWNER_EMAIL || !OWNER_PASSWORD) {
      throw new Error("Owner email or password not set in .env file");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(OWNER_PASSWORD, salt);

    const newOwner = new Owner({
      email: OWNER_EMAIL,
      passwordHash: passwordHash,
    });

    await newOwner.save();
    console.log("Owner account has been created successfully!");
    console.log(`Email: ${OWNER_EMAIL}`);
    console.log(`Password: ${OWNER_PASSWORD}`);

  } catch (error) {
    console.error("Error seeding database:", error.message);
  } finally {
    mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
};

seedDB();

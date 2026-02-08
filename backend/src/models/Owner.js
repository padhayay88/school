const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  tokenVersion: { type: Number, default: 0 },
}, { timestamps: true });

const Owner = mongoose.model("Owner", ownerSchema);

module.exports = Owner;

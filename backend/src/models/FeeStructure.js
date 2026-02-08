const mongoose = require("mongoose");

const feeStructureSchema = new mongoose.Schema({
  className: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
});

const FeeStructure = mongoose.model("FeeStructure", feeStructureSchema);

module.exports = FeeStructure;

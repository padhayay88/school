const mongoose = require("mongoose");

const feePaymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  amountPaid: { type: Number, required: true },
  paidOn: { type: Date, default: Date.now },
  status: { type: String, enum: ['paid', 'unpaid', 'partial'], default: 'paid' },
}, { timestamps: true });

const FeePayment = mongoose.model("FeePayment", feePaymentSchema);

module.exports = FeePayment;

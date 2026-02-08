const FeeStructure = require("../models/FeeStructure");
const FeePayment = require("../models/FeePayment");
const Student = require("../models/Student");

const listFeeStructures = async (req, res, next) => {
  try {
    const structures = await FeeStructure.find().sort({ className: 1 });
    res.json(structures);
  } catch (error) {
    next(error);
  }
};

const createFeeStructure = async (req, res, next) => {
  try {
    const { className, amount } = req.body;
    if (!className || amount === undefined) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    const feeStructure = new FeeStructure({ className, amount });
    await feeStructure.save();
    res.status(201).json(feeStructure);
  } catch (error) {
    next(error);
  }
};

const updateFeeStructure = async (req, res, next) => {
  try {
    const { id } = req.params;
    const feeStructure = await FeeStructure.findByIdAndUpdate(id, req.body, { new: true });
    res.json(feeStructure);
  } catch (error) {
    next(error);
  }
};

const listPayments = async (req, res, next) => {
  try {
    const payments = await FeePayment.find().populate('studentId', 'fullName').sort({ paidOn: -1 });
    res.json(payments);
  } catch (error) {
    next(error);
  }
};

const recordPayment = async (req, res, next) => {
  try {
    const { studentId, amountPaid, paidOn, status } = req.body;
    if (!studentId || amountPaid === undefined) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    const feePayment = new FeePayment({ studentId, amountPaid, paidOn, status });
    await feePayment.save();
    res.status(201).json(feePayment);
  } catch (error) {
    next(error);
  }
};

const listStudentPayments = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const payments = await FeePayment.find({ studentId }).sort({ paidOn: -1 });
    res.json(payments);
  } catch (error) {
    next(error);
  }
};

const deletePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await FeePayment.findByIdAndDelete(id);
    res.json({ message: "Payment deleted" });
  } catch (error) {
    next(error);
  }
};

const deleteFeeStructure = async (req, res, next) => {
  try {
    const { id } = req.params;
    await FeeStructure.findByIdAndDelete(id);
    res.json({ message: "Fee structure deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listFeeStructures,
  createFeeStructure,
  updateFeeStructure,
  listPayments,
  recordPayment,
  listStudentPayments,
  deletePayment,
  deleteFeeStructure,
};

const Student = require("../models/Student");
const FeePayment = require("../models/FeePayment");
const FeeStructure = require("../models/FeeStructure");

const studentListReport = async (req, res, next) => {
  try {
    const students = await Student.find().sort({ className: 1, section: 1, rollNumber: 1 });
    res.json(students);
  } catch (error) {
    next(error);
  }
};

const feeCollectionReport = async (req, res, next) => {
  try {
    const payments = await FeePayment.find().populate('studentId', 'fullName className').sort({ paidOn: -1 });
    res.json(payments);
  } catch (error) {
    next(error);
  }
};

const pendingDuesReport = async (req, res, next) => {
  try {
    const students = await Student.find();
    const feeStructures = await FeeStructure.find();
    const payments = await FeePayment.find({ status: 'paid' });

    const report = students.map(student => {
      const structure = feeStructures.find(fs => fs.className === student.className);
      if (!structure) return null;

      const totalPaid = payments
        .filter(p => p.studentId.toString() === student._id.toString())
        .reduce((acc, p) => acc + p.amountPaid, 0);
      
      const due = structure.amount - totalPaid;

      if (due > 0) {
        return {
          fullName: student.fullName,
          className: student.className,
          totalFee: structure.amount,
          paid: totalPaid,
          due: due,
        };
      }
      return null;
    }).filter(Boolean);

    res.json(report);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  studentListReport,
  feeCollectionReport,
  pendingDuesReport,
};

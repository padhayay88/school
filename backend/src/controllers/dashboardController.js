const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const FeePayment = require("../models/FeePayment");
const FeeStructure = require("../models/FeeStructure");

const getSummary = async (req, res, next) => {
  try {
    const studentCount = await Student.countDocuments();
    const teacherCount = await Teacher.countDocuments();
    const feeCollected = await FeePayment.aggregate([
      { $group: { _id: null, total: { $sum: "$amountPaid" } } }
    ]);

    const students = await Student.find();
    const feeStructures = await FeeStructure.find();
    const payments = await FeePayment.find({ status: 'paid' });

    let totalPendingFees = 0;
    students.forEach(student => {
      const structure = feeStructures.find(fs => fs.className === student.className);
      if (structure) {
        const totalPaid = payments
          .filter(p => p.studentId.toString() === student._id.toString())
          .reduce((acc, p) => acc + p.amountPaid, 0);
        totalPendingFees += (structure.amount - totalPaid);
      }
    });

    res.json({
      students: studentCount,
      teachers: teacherCount,
      totalFeesCollected: feeCollected[0]?.total || 0,
      totalPendingFees: totalPendingFees > 0 ? totalPendingFees : 0,
    });
  } catch (error) {
    next(error);
  }
};

const getMonthlyFeeCollection = async (req, res, next) => {
  try {
    const monthlyData = await FeePayment.aggregate([
      {
        $group: {
          _id: { $month: "$paidOn" },
          total: { $sum: "$amountPaid" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(monthlyData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getMonthlyFeeCollection,
};

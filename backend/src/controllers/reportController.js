// SIMPLE MODE: No database - mock data

const studentListReport = async (req, res, next) => {
  try {
    const students = [
      { _id: "1", fullName: "Rahul Kumar", className: "10th", section: "A", rollNumber: "101", status: "active" },
      { _id: "2", fullName: "Priya Sharma", className: "10th", section: "A", rollNumber: "102", status: "active" },
      { _id: "3", fullName: "Amit Singh", className: "9th", section: "B", rollNumber: "201", status: "active" },
    ];
    res.json(students);
  } catch (error) {
    next(error);
  }
};

const feeCollectionReport = async (req, res, next) => {
  try {
    const payments = [
      { _id: "1", studentId: { fullName: "Rahul Kumar", className: "10th" }, amountPaid: 15000, paidOn: new Date(), status: "paid" },
      { _id: "2", studentId: { fullName: "Priya Sharma", className: "10th" }, amountPaid: 30000, paidOn: new Date(), status: "paid" },
    ];
    res.json(payments);
  } catch (error) {
    next(error);
  }
};

const pendingDuesReport = async (req, res, next) => {
  try {
    const report = [
      { fullName: "Rahul Kumar", className: "10th", totalFee: 30000, paid: 15000, due: 15000 },
      { fullName: "Amit Singh", className: "9th", totalFee: 25000, paid: 5000, due: 20000 },
    ];
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

// SIMPLE MODE: No database - mock data

const mockFeeStructures = [
  { _id: "1", className: "9th", amount: 25000 },
  { _id: "2", className: "10th", amount: 30000 },
];

const mockPayments = [
  { _id: "1", studentId: { _id: "1", fullName: "Rahul Kumar" }, amountPaid: 15000, paidOn: new Date(), status: "paid" },
  { _id: "2", studentId: { _id: "2", fullName: "Priya Sharma" }, amountPaid: 30000, paidOn: new Date(), status: "paid" },
];

const listFeeStructures = async (req, res, next) => {
  try {
    res.json(mockFeeStructures);
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
    const feeStructure = { _id: Date.now().toString(), className, amount };
    mockFeeStructures.push(feeStructure);
    res.status(201).json(feeStructure);
  } catch (error) {
    next(error);
  }
};

const updateFeeStructure = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idx = mockFeeStructures.findIndex(f => f._id === id);
    if (idx !== -1) {
      mockFeeStructures[idx] = { ...mockFeeStructures[idx], ...req.body };
      res.json(mockFeeStructures[idx]);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};

const listPayments = async (req, res, next) => {
  try {
    res.json(mockPayments);
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
    const feePayment = { _id: Date.now().toString(), studentId, amountPaid, paidOn, status };
    mockPayments.push(feePayment);
    res.status(201).json(feePayment);
  } catch (error) {
    next(error);
  }
};

const listStudentPayments = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const payments = mockPayments.filter(p => p.studentId._id === studentId || p.studentId === studentId);
    res.json(payments);
  } catch (error) {
    next(error);
  }
};

const deletePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idx = mockPayments.findIndex(p => p._id === id);
    if (idx !== -1) mockPayments.splice(idx, 1);
    res.json({ message: "Payment deleted" });
  } catch (error) {
    next(error);
  }
};

const deleteFeeStructure = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idx = mockFeeStructures.findIndex(f => f._id === id);
    if (idx !== -1) mockFeeStructures.splice(idx, 1);
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

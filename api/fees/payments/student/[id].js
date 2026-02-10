const { requireAuth, setCorsHeaders } = require("../../../_utils");

module.exports = (req, res) => {
  const origin = req.headers.origin;
  setCorsHeaders(res, origin);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const owner = requireAuth(req);
  if (!owner) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Get student ID from URL
  const urlParts = req.url.split("/");
  const studentId = urlParts[urlParts.length - 1].split("?")[0];

  // Mock payments for this student
  const allPayments = [
    { _id: "1", studentId: "1", amountPaid: 15000, paidOn: new Date().toISOString(), status: "paid" },
    { _id: "2", studentId: "2", amountPaid: 30000, paidOn: new Date().toISOString(), status: "paid" },
  ];

  const studentPayments = allPayments.filter(p => p.studentId === studentId);

  return res.status(200).json(studentPayments);
};

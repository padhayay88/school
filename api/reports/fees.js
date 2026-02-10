const { requireAuth, setCorsHeaders } = require("../_utils");

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

  const payments = [
    { _id: "1", studentId: { fullName: "Rahul Kumar", className: "10th" }, amountPaid: 15000, paidOn: new Date().toISOString(), status: "paid" },
    { _id: "2", studentId: { fullName: "Priya Sharma", className: "10th" }, amountPaid: 30000, paidOn: new Date().toISOString(), status: "paid" },
  ];

  return res.status(200).json(payments);
};

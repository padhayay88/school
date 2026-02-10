const { requireAuth, setCorsHeaders } = require("../../_utils");

let payments = [
  { _id: "1", studentId: { _id: "1", fullName: "Rahul Kumar" }, amountPaid: 15000, paidOn: new Date().toISOString(), status: "paid" },
  { _id: "2", studentId: { _id: "2", fullName: "Priya Sharma" }, amountPaid: 30000, paidOn: new Date().toISOString(), status: "paid" },
];

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

  if (req.method === "GET") {
    return res.status(200).json(payments);
  }

  if (req.method === "POST") {
    const { studentId, amountPaid, paidOn, status } = req.body || {};
    if (!studentId || amountPaid === undefined) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    const payment = { _id: Date.now().toString(), studentId, amountPaid, paidOn: paidOn || new Date().toISOString(), status: status || "paid" };
    payments.push(payment);
    return res.status(201).json(payment);
  }

  return res.status(405).json({ message: "Method not allowed" });
};

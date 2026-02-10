const { setCorsHeaders, requireAuth } = require("../_utils");

let feeStructures = [
  { _id: "1", className: "9th", amount: 25000 },
  { _id: "2", className: "10th", amount: 30000 },
];

let payments = [
  { _id: "1", studentId: { _id: "1", fullName: "Rahul Kumar" }, amountPaid: 15000, paidOn: new Date().toISOString(), status: "paid" },
  { _id: "2", studentId: { _id: "2", fullName: "Priya Sharma" }, amountPaid: 30000, paidOn: new Date().toISOString(), status: "paid" },
];

module.exports = (req, res) => {
  const origin = req.headers.origin;
  setCorsHeaders(res, origin);
  if (req.method === "OPTIONS") return res.status(200).end();

  const owner = requireAuth(req);
  if (!owner) return res.status(401).json({ message: "Unauthorized" });

  const url = req.url.split("?")[0];
  const path = url.replace("/api/fees", "").replace(/^\//, "");
  const parts = path.split("/").filter(Boolean);

  try {
    // GET /api/fees/structures
    if (parts[0] === "structures" && req.method === "GET") {
      return res.status(200).json(feeStructures);
    }

    // POST /api/fees/structures
    if (parts[0] === "structures" && req.method === "POST") {
      const { className, amount } = req.body || {};
      if (!className || amount === undefined) {
        return res.status(400).json({ message: "Required fields missing" });
      }
      const structure = { _id: Date.now().toString(), className, amount };
      feeStructures.push(structure);
      return res.status(201).json(structure);
    }

    // PUT /api/fees/structures/:id
    if (parts[0] === "structures" && parts[1] && req.method === "PUT") {
      const idx = feeStructures.findIndex(f => f._id === parts[1]);
      if (idx === -1) return res.status(404).json({ message: "Not found" });
      feeStructures[idx] = { ...feeStructures[idx], ...req.body };
      return res.status(200).json(feeStructures[idx]);
    }

    // DELETE /api/fees/structures/:id
    if (parts[0] === "structures" && parts[1] && req.method === "DELETE") {
      feeStructures = feeStructures.filter(f => f._id !== parts[1]);
      return res.status(200).json({ message: "Deleted" });
    }

    // GET /api/fees/payments
    if (parts[0] === "payments" && !parts[1] && req.method === "GET") {
      return res.status(200).json(payments);
    }

    // POST /api/fees/payments
    if (parts[0] === "payments" && !parts[1] && req.method === "POST") {
      const { studentId, amountPaid, paidOn, status } = req.body || {};
      if (!studentId || amountPaid === undefined) {
        return res.status(400).json({ message: "Required fields missing" });
      }
      const payment = { _id: Date.now().toString(), studentId, amountPaid, paidOn: paidOn || new Date().toISOString(), status: status || "paid" };
      payments.push(payment);
      return res.status(201).json(payment);
    }

    // GET /api/fees/payments/student/:studentId
    if (parts[0] === "payments" && parts[1] === "student" && parts[2] && req.method === "GET") {
      const studentPayments = payments.filter(p => 
        (p.studentId._id === parts[2]) || (p.studentId === parts[2])
      );
      return res.status(200).json(studentPayments);
    }

    // DELETE /api/fees/payments/:id
    if (parts[0] === "payments" && parts[1] && req.method === "DELETE") {
      payments = payments.filter(p => p._id !== parts[1]);
      return res.status(200).json({ message: "Deleted" });
    }

    return res.status(404).json({ message: "Not found" });
  } catch (error) {
    console.error("Fees error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

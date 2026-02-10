const { setCorsHeaders, requireAuth } = require("../_utils");

module.exports = (req, res) => {
  const origin = req.headers.origin;
  setCorsHeaders(res, origin);
  if (req.method === "OPTIONS") return res.status(200).end();

  const owner = requireAuth(req);
  if (!owner) return res.status(401).json({ message: "Unauthorized" });

  const url = req.url.split("?")[0];
  const path = url.replace("/api/reports", "").replace(/^\//, "");

  try {
    // GET /api/reports/students
    if (path === "students" && req.method === "GET") {
      return res.status(200).json([
        { _id: "1", fullName: "Rahul Kumar", className: "10th", section: "A", rollNumber: "101", status: "active" },
        { _id: "2", fullName: "Priya Sharma", className: "10th", section: "A", rollNumber: "102", status: "active" },
        { _id: "3", fullName: "Amit Singh", className: "9th", section: "B", rollNumber: "201", status: "active" },
      ]);
    }

    // GET /api/reports/fees
    if (path === "fees" && req.method === "GET") {
      return res.status(200).json([
        { _id: "1", studentId: { fullName: "Rahul Kumar", className: "10th" }, amountPaid: 15000, paidOn: new Date().toISOString(), status: "paid" },
        { _id: "2", studentId: { fullName: "Priya Sharma", className: "10th" }, amountPaid: 30000, paidOn: new Date().toISOString(), status: "paid" },
      ]);
    }

    // GET /api/reports/pending-dues
    if (path === "pending-dues" && req.method === "GET") {
      return res.status(200).json([
        { fullName: "Rahul Kumar", className: "10th", totalFee: 30000, paid: 15000, due: 15000 },
        { fullName: "Amit Singh", className: "9th", totalFee: 25000, paid: 5000, due: 20000 },
      ]);
    }

    return res.status(404).json({ message: "Not found" });
  } catch (error) {
    console.error("Reports error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

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

  const report = [
    { fullName: "Rahul Kumar", className: "10th", totalFee: 30000, paid: 15000, due: 15000 },
    { fullName: "Amit Singh", className: "9th", totalFee: 25000, paid: 5000, due: 20000 },
  ];

  return res.status(200).json(report);
};

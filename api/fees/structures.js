const { requireAuth, setCorsHeaders } = require("../_utils");

// In-memory mock data
let feeStructures = [
  { _id: "1", className: "9th", amount: 25000 },
  { _id: "2", className: "10th", amount: 30000 },
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
    return res.status(200).json(feeStructures);
  }

  if (req.method === "POST") {
    const { className, amount } = req.body || {};
    if (!className || amount === undefined) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    const structure = { _id: Date.now().toString(), className, amount };
    feeStructures.push(structure);
    return res.status(201).json(structure);
  }

  return res.status(405).json({ message: "Method not allowed" });
};

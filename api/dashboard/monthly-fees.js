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

  // Mock monthly data
  const monthlyData = [
    { _id: 1, total: 35000 },
    { _id: 2, total: 42000 },
    { _id: 3, total: 38000 },
    { _id: 4, total: 45000 },
    { _id: 5, total: 50000 },
    { _id: 6, total: 40000 },
  ];

  return res.status(200).json(monthlyData);
};

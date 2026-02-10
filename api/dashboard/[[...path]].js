const { setCorsHeaders, requireAuth } = require("../_utils");

module.exports = (req, res) => {
  const origin = req.headers.origin;
  setCorsHeaders(res, origin);
  if (req.method === "OPTIONS") return res.status(200).end();

  const owner = requireAuth(req);
  if (!owner) return res.status(401).json({ message: "Unauthorized" });

  const url = req.url.split("?")[0];
  const path = url.replace("/api/dashboard", "").replace(/^\//, "") || "summary";

  try {
    // GET /api/dashboard/summary or /api/dashboard
    if ((path === "summary" || path === "") && req.method === "GET") {
      return res.status(200).json({
        students: 150,
        teachers: 12,
        totalFeesCollected: 450000,
        totalPendingFees: 75000,
      });
    }

    // GET /api/dashboard/monthly-fees
    if (path === "monthly-fees" && req.method === "GET") {
      return res.status(200).json([
        { _id: 1, total: 35000 },
        { _id: 2, total: 42000 },
        { _id: 3, total: 38000 },
        { _id: 4, total: 45000 },
        { _id: 5, total: 50000 },
        { _id: 6, total: 40000 },
      ]);
    }

    return res.status(404).json({ message: "Not found" });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

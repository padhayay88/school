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

  const students = [
    { _id: "1", fullName: "Rahul Kumar", className: "10th", section: "A", rollNumber: "101", status: "active" },
    { _id: "2", fullName: "Priya Sharma", className: "10th", section: "A", rollNumber: "102", status: "active" },
    { _id: "3", fullName: "Amit Singh", className: "9th", section: "B", rollNumber: "201", status: "active" },
  ];

  return res.status(200).json(students);
};

const { requireAuth, setCorsHeaders } = require("../_utils");

// In-memory mock data
let students = [
  { _id: "1", fullName: "Rahul Kumar", className: "10th", section: "A", rollNumber: "101", parentContact: "9876543210", status: "active" },
  { _id: "2", fullName: "Priya Sharma", className: "10th", section: "A", rollNumber: "102", parentContact: "9876543211", status: "active" },
  { _id: "3", fullName: "Amit Singh", className: "9th", section: "B", rollNumber: "201", parentContact: "9876543212", status: "active" },
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

  // GET - List students
  if (req.method === "GET") {
    return res.status(200).json(students);
  }

  // POST - Create student
  if (req.method === "POST") {
    const { fullName, className, section, rollNumber, parentContact, status } = req.body || {};
    if (!fullName || !className || !rollNumber) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    const student = { _id: Date.now().toString(), fullName, className, section, rollNumber, parentContact, status: status || "active" };
    students.push(student);
    return res.status(201).json(student);
  }

  return res.status(405).json({ message: "Method not allowed" });
};

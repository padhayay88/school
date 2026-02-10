const { requireAuth, setCorsHeaders } = require("../_utils");

// Shared student storage (serverless = fresh on each cold start, but works for demo)
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

  // Get ID from URL
  const urlParts = req.url.split("/");
  const id = urlParts[urlParts.length - 1].split("?")[0];

  // PUT - Update student
  if (req.method === "PUT") {
    const idx = students.findIndex(s => s._id === id);
    if (idx === -1) {
      return res.status(404).json({ message: "Student not found" });
    }
    students[idx] = { ...students[idx], ...req.body };
    return res.status(200).json(students[idx]);
  }

  // DELETE - Delete student
  if (req.method === "DELETE") {
    const idx = students.findIndex(s => s._id === id);
    if (idx !== -1) {
      students.splice(idx, 1);
    }
    return res.status(200).json({ message: "Deleted" });
  }

  // GET - Get single student
  if (req.method === "GET") {
    const student = students.find(s => s._id === id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    return res.status(200).json(student);
  }

  return res.status(405).json({ message: "Method not allowed" });
};

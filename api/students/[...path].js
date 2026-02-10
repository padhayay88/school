const { setCorsHeaders, requireAuth } = require("../_utils");

// In-memory mock data
let students = [
  { _id: "1", fullName: "Rahul Kumar", className: "10th", section: "A", rollNumber: "101", parentContact: "9876543210", status: "active" },
  { _id: "2", fullName: "Priya Sharma", className: "10th", section: "A", rollNumber: "102", parentContact: "9876543211", status: "active" },
  { _id: "3", fullName: "Amit Singh", className: "9th", section: "B", rollNumber: "201", parentContact: "9876543212", status: "active" },
];

module.exports = (req, res) => {
  const origin = req.headers.origin;
  setCorsHeaders(res, origin);
  if (req.method === "OPTIONS") return res.status(200).end();

  const owner = requireAuth(req);
  if (!owner) return res.status(401).json({ message: "Unauthorized" });

  const url = req.url.split("?")[0];
  const parts = url.replace("/api/students", "").split("/").filter(Boolean);
  const id = parts[0] || null;

  try {
    // GET /api/students - List all
    if (!id && req.method === "GET") {
      return res.status(200).json(students);
    }

    // POST /api/students - Create
    if (!id && req.method === "POST") {
      const { fullName, className, section, rollNumber, parentContact, status } = req.body || {};
      if (!fullName || !className || !rollNumber) {
        return res.status(400).json({ message: "Required fields missing" });
      }
      const student = { _id: Date.now().toString(), fullName, className, section, rollNumber, parentContact, status: status || "active" };
      students.push(student);
      return res.status(201).json(student);
    }

    // GET /api/students/:id
    if (id && req.method === "GET") {
      const student = students.find(s => s._id === id);
      if (!student) return res.status(404).json({ message: "Not found" });
      return res.status(200).json(student);
    }

    // PUT /api/students/:id
    if (id && req.method === "PUT") {
      const idx = students.findIndex(s => s._id === id);
      if (idx === -1) return res.status(404).json({ message: "Not found" });
      students[idx] = { ...students[idx], ...req.body };
      return res.status(200).json(students[idx]);
    }

    // DELETE /api/students/:id
    if (id && req.method === "DELETE") {
      students = students.filter(s => s._id !== id);
      return res.status(200).json({ message: "Deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Students error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

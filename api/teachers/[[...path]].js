const { setCorsHeaders, requireAuth } = require("../_utils");

let teachers = [
  { _id: "1", fullName: "Mr. Rajesh Gupta", subject: "Mathematics", classesAssigned: ["9th", "10th"], salary: 35000, status: "active" },
  { _id: "2", fullName: "Mrs. Sunita Devi", subject: "Science", classesAssigned: ["10th"], salary: 32000, status: "active" },
  { _id: "3", fullName: "Mr. Arun Verma", subject: "Hindi", classesAssigned: ["8th", "9th"], salary: 28000, status: "active" },
];

module.exports = (req, res) => {
  const origin = req.headers.origin;
  setCorsHeaders(res, origin);
  if (req.method === "OPTIONS") return res.status(200).end();

  const owner = requireAuth(req);
  if (!owner) return res.status(401).json({ message: "Unauthorized" });

  const url = req.url.split("?")[0];
  const parts = url.replace("/api/teachers", "").split("/").filter(Boolean);
  const id = parts[0] || null;

  try {
    if (!id && req.method === "GET") {
      return res.status(200).json(teachers);
    }

    if (!id && req.method === "POST") {
      const { fullName, subject, classesAssigned, salary, status } = req.body || {};
      if (!fullName || !subject) {
        return res.status(400).json({ message: "Required fields missing" });
      }
      const teacher = { _id: Date.now().toString(), fullName, subject, classesAssigned, salary, status: status || "active" };
      teachers.push(teacher);
      return res.status(201).json(teacher);
    }

    if (id && req.method === "GET") {
      const teacher = teachers.find(t => t._id === id);
      if (!teacher) return res.status(404).json({ message: "Not found" });
      return res.status(200).json(teacher);
    }

    if (id && req.method === "PUT") {
      const idx = teachers.findIndex(t => t._id === id);
      if (idx === -1) return res.status(404).json({ message: "Not found" });
      teachers[idx] = { ...teachers[idx], ...req.body };
      return res.status(200).json(teachers[idx]);
    }

    if (id && req.method === "DELETE") {
      teachers = teachers.filter(t => t._id !== id);
      return res.status(200).json({ message: "Deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Teachers error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

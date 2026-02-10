const { requireAuth, setCorsHeaders } = require("../_utils");

// In-memory mock data
let teachers = [
  { _id: "1", fullName: "Mr. Rajesh Gupta", subject: "Mathematics", classesAssigned: ["9th", "10th"], salary: 35000, status: "active" },
  { _id: "2", fullName: "Mrs. Sunita Devi", subject: "Science", classesAssigned: ["10th"], salary: 32000, status: "active" },
  { _id: "3", fullName: "Mr. Arun Verma", subject: "Hindi", classesAssigned: ["8th", "9th"], salary: 28000, status: "active" },
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

  // GET - List teachers
  if (req.method === "GET") {
    return res.status(200).json(teachers);
  }

  // POST - Create teacher
  if (req.method === "POST") {
    const { fullName, subject, classesAssigned, salary, status } = req.body || {};
    if (!fullName || !subject) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    const teacher = { _id: Date.now().toString(), fullName, subject, classesAssigned, salary, status: status || "active" };
    teachers.push(teacher);
    return res.status(201).json(teacher);
  }

  return res.status(405).json({ message: "Method not allowed" });
};

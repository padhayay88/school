const { requireAuth, setCorsHeaders } = require("../_utils");

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

  const urlParts = req.url.split("/");
  const id = urlParts[urlParts.length - 1].split("?")[0];

  if (req.method === "PUT") {
    const idx = teachers.findIndex(t => t._id === id);
    if (idx === -1) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    teachers[idx] = { ...teachers[idx], ...req.body };
    return res.status(200).json(teachers[idx]);
  }

  if (req.method === "DELETE") {
    const idx = teachers.findIndex(t => t._id === id);
    if (idx !== -1) {
      teachers.splice(idx, 1);
    }
    return res.status(200).json({ message: "Deleted" });
  }

  if (req.method === "GET") {
    const teacher = teachers.find(t => t._id === id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    return res.status(200).json(teacher);
  }

  return res.status(405).json({ message: "Method not allowed" });
};

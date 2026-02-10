// SIMPLE MODE: No database - mock data

const mockTeachers = [
  { _id: "1", fullName: "Mr. Rajesh Gupta", subject: "Mathematics", classesAssigned: ["9th", "10th"], salary: 35000, status: "active" },
  { _id: "2", fullName: "Mrs. Sunita Devi", subject: "Science", classesAssigned: ["10th"], salary: 32000, status: "active" },
  { _id: "3", fullName: "Mr. Arun Verma", subject: "Hindi", classesAssigned: ["8th", "9th"], salary: 28000, status: "active" },
];

const listTeachers = async (req, res, next) => {
  try {
    res.json(mockTeachers);
  } catch (error) {
    next(error);
  }
};

const createTeacher = async (req, res, next) => {
  try {
    const { fullName, subject, classesAssigned, salary, status } = req.body;
    if (!fullName || !subject) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    const teacher = { _id: Date.now().toString(), fullName, subject, classesAssigned, salary, status };
    mockTeachers.push(teacher);
    res.status(201).json(teacher);
  } catch (error) {
    next(error);
  }
};

const updateTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idx = mockTeachers.findIndex(t => t._id === id);
    if (idx !== -1) {
      mockTeachers[idx] = { ...mockTeachers[idx], ...req.body };
      res.json(mockTeachers[idx]);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};

const deleteTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idx = mockTeachers.findIndex(t => t._id === id);
    if (idx !== -1) mockTeachers.splice(idx, 1);
    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};

// SIMPLE MODE: No database - mock data

const mockStudents = [
  { _id: "1", fullName: "Rahul Kumar", className: "10th", section: "A", rollNumber: "101", parentContact: "9876543210", status: "active" },
  { _id: "2", fullName: "Priya Sharma", className: "10th", section: "A", rollNumber: "102", parentContact: "9876543211", status: "active" },
  { _id: "3", fullName: "Amit Singh", className: "9th", section: "B", rollNumber: "201", parentContact: "9876543212", status: "active" },
];

const listStudents = async (req, res, next) => {
  try {
    res.json(mockStudents);
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const { fullName, className, section, rollNumber, parentContact, status } = req.body;
    if (!fullName || !className || !rollNumber) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    const student = { _id: Date.now().toString(), fullName, className, section, rollNumber, parentContact, status };
    mockStudents.push(student);
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idx = mockStudents.findIndex(s => s._id === id);
    if (idx !== -1) {
      mockStudents[idx] = { ...mockStudents[idx], ...req.body };
      res.json(mockStudents[idx]);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idx = mockStudents.findIndex(s => s._id === id);
    if (idx !== -1) mockStudents.splice(idx, 1);
    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listStudents,
  createStudent,
  updateStudent,
  deleteStudent,
};

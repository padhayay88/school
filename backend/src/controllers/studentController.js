const Student = require("../models/Student");

const listStudents = async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
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
    const student = new Student({ fullName, className, section, rollNumber, parentContact, status });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndUpdate(id, req.body, { new: true });
    res.json(student);
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
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

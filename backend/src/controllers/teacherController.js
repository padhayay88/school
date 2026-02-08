const Teacher = require("../models/Teacher");

const listTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.json(teachers);
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
    const teacher = new Teacher({ fullName, subject, classesAssigned, salary, status });
    await teacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    next(error);
  }
};

const updateTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByIdAndUpdate(id, req.body, { new: true });
    res.json(teacher);
  } catch (error) {
    next(error);
  }
};

const deleteTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Teacher.findByIdAndDelete(id);
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

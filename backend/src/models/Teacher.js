const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  subject: { type: String, required: true },
  classesAssigned: String,
  salary: Number,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;

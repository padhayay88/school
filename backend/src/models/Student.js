const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  className: { type: String, required: true },
  section: String,
  rollNumber: { type: String, required: true },
  parentContact: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
